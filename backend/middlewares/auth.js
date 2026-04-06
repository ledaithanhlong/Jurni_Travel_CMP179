import { clerkMiddleware, requireAuth as clerkRequireAuth, getAuth } from '@clerk/express';
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

        let user = await db.User.findOne({ where: { clerkId: auth.userId } });

        if (user) {
            req.user = user;
        }
        return next();
    } catch (e) {
        return res.status(500).send({ message: 'xu ly xac thuc that bai' });
    }
};

export const requireAuth = [clerkRequireAuth(), syncUser];

export const requireRole = (role) => async (req, res, next) => {
    try {
        const auth = getAuth(req);
        if (!auth?.userId) {
            return res.status(401).send({ message: 'chua dang nhap' });
        }

        const clerkId = auth.userId;

        // Tim user trong DB theo clerkId.
        let user = await db.User.findOne({ where: { clerkId } });

        let email = user?.email;
        if (!email && auth.sessionClaims) {
            // Neu DB chua co email thi lay tu session claims.
            email = auth.sessionClaims.email ||
                auth.sessionClaims.primary_email_address ||
                (auth.sessionClaims.email_addresses && Array.isArray(auth.sessionClaims.email_addresses)
                    ? auth.sessionClaims.email_addresses[0]?.email_address || auth.sessionClaims.email_addresses[0]
                    : null);
        }

        const isAdminByEmail = email && env.adminEmails.includes(email);

        // Neu user la admin nhung chua ton tai thi tao moi.
        if (!user && isAdminByEmail) {
            user = await db.User.create({
                clerkId,
                name: auth.sessionClaims?.name || email?.split('@')[0] || 'Admin',
                email: email,
                role: 'admin'
            });
        }

        // Dong bo role admin khi can.
        if (user && isAdminByEmail && user.role !== 'admin') {
            await user.update({ role: 'admin' });
            user.role = 'admin';
        }

        const roleValue = user?.role || (isAdminByEmail ? 'admin' : 'user');

        if (role === 'admin' && roleValue !== 'admin') {
            return res.status(403).send({
                message: 'Can quyen admin',
                userRole: roleValue,
                userEmail: email
            });
        }

        req.user = user || null;
        return next();
    } catch (e) {
        return res.status(500).send({ message: 'kiem tra quyen that bai' });
    }
};

