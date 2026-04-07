import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express';
import { env } from '../config/env.js';
import db from '../models/index.js';

// Middleware xac thuc va dong bo thong tin user tu Clerk vao DB local.
export const clerkAuth = env.clerk.secretKey
    ? clerkMiddleware({ secretKey: env.clerk.secretKey })
    : clerkMiddleware();


export const syncUser = async (req, res, next) => {
    try {
        const auth = getAuth(req);
        if (!auth?.userId) return next();

        const claims = auth.sessionClaims || {};

        let email =
            claims.email ||
            claims.primary_email_address ||
            claims.primaryEmail ||
            claims.email_address ||
            null;

        let name =
            claims.name ||
            claims.first_name ||
            claims.firstName ||
            claims.username ||
            null;

        // If session claims don't include email (common), fallback to Clerk API.
        if (!email) {
            try {
                const clerkUser = await clerkClient.users.getUser(auth.userId);
                const primaryEmailObj = clerkUser.emailAddresses?.find(
                    (e) => e.id === clerkUser.primaryEmailAddressId
                );
                email =
                    primaryEmailObj?.emailAddress ||
                    clerkUser.emailAddresses?.[0]?.emailAddress ||
                    null;
                name =
                    name ||
                    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
                    clerkUser.username ||
                    null;
            } catch {
                // Ignore: keep email as null; we'll use a temp email.
            }
        }

        const emailLower = email ? String(email).toLowerCase() : null;
        const isAdmin =
            emailLower &&
            env.adminEmails.map((e) => e.toLowerCase()).includes(emailLower);

        // Prefer finding by clerkId, but also reconcile by email if we now have it.
        let user = await db.User.findOne({ clerkId: auth.userId });
        if (!user && emailLower) {
            user = await db.User.findOne({ email: emailLower });
            if (user && user.clerkId !== auth.userId) {
                user.clerkId = auth.userId;
            }
        }

        if (!user) {
            user = await db.User.create({
                clerkId: auth.userId,
                name: name || (emailLower ? emailLower.split('@')[0] : 'User'),
                email: emailLower || `temp_${auth.userId}@pending.clerk`,
                role: isAdmin ? 'admin' : 'user',
            });
        } else {
            let changed = false;
            if (emailLower && user.email !== emailLower) {
                user.email = emailLower;
                changed = true;
            }
            if (name && user.name !== name) {
                user.name = name;
                changed = true;
            }
            if (isAdmin && user.role !== 'admin') {
                user.role = 'admin';
                changed = true;
            }
            if (changed) await user.save();
        }

        req.user = user;
        return next();
    } catch (e) {
        return res.status(500).send({ message: 'xu ly xac thuc that bai' });
    }
};

export const requireAuth = [
    clerkAuth,
    syncUser,
    (req, res, next) => {
        if (!req.user) return res.status(401).send({ message: 'Chưa đăng nhập' });
        return next();
    },
];

export const requireRole = (role) => [
    clerkAuth,
    syncUser,
    async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).send({ message: 'Chưa đăng nhập hoặc người dùng không tồn tại.' });
            }

            const userRole = req.user.role;
            if (role === 'admin' && userRole !== 'admin') {
                return res.status(403).send({
                    message: 'Cần quyền admin',
                    userRole: userRole,
                    userEmail: req.user.email
                });
            }

            return next();
        } catch (e) {
            return res.status(500).send({ message: 'Kiểm tra quyền thất bại' });
        }
    }
];
