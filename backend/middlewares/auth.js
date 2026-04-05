import { clerkMiddleware, getAuth } from '@clerk/express';
import { env } from '../config/env.js';
import db from '../models/index.js';

const clerkAuth = env.clerk?.secretKey
    ? clerkMiddleware({ secretKey: env.clerk.secretKey })
    : clerkMiddleware();

async function syncUser(req, res, next) {
    try {
        let auth;
        try {
            auth = getAuth(req);
        } catch (error) {
            return next();
        }
        if (!auth?.userId) {
            return next();
        }

        const user = await db.User.findOne({ clerkId: auth.userId });
        if (user) {
            req.user = user;
        }

        return next();
    } catch (error) {
        return next(error);
    }
}

const requireAuth = [
    syncUser,
    async function (req, res, next) {
        try {
            let auth;
            try {
                auth = getAuth(req);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            if (!auth?.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            if (!req.user) {
                req.user = await db.User.findOne({ clerkId: auth.userId });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    },
];

function requireRole(role) {
    return async function (req, res, next) {
        try {
            const auth = getAuth(req);
            if (!auth?.userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            let user = req.user || await db.User.findOne({ clerkId: auth.userId });

            let email = user?.email || null;
            if (!email && auth.sessionClaims) {
                email =
                    auth.sessionClaims.email ||
                    auth.sessionClaims.primary_email_address ||
                    (Array.isArray(auth.sessionClaims.email_addresses)
                        ? auth.sessionClaims.email_addresses[0]?.email_address || auth.sessionClaims.email_addresses[0]
                        : null);
            }

            const isAdminByEmail = Boolean(email && env.adminEmails.includes(email));

            if (!user && isAdminByEmail) {
                user = await db.User.create({
                    clerkId: auth.userId,
                    name: auth.sessionClaims?.name || email?.split('@')[0] || 'Admin',
                    email,
                    role: 'admin',
                });
            }

            if (user && isAdminByEmail && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }

            const currentRole = user?.role || (isAdminByEmail ? 'admin' : 'user');
            if (role && currentRole !== role) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden',
                });
            }

            req.user = user || null;
            return next();
        } catch (error) {
            return next(error);
        }
    };
}

export {
    clerkAuth, requireAuth,
    requireRole, syncUser
};

