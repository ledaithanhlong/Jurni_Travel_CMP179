import { Router } from 'express';
import { env } from '../config/env.js';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import db from '../models/index.js';

const router = Router();

router.post('/sync-user', clerkAuth, requireAuth, async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;

        if (!clerkId) {
            return res.status(400).send({ message: 'thieu user id' });
        }

        const sessionClaims = req.auth.sessionClaims || {};

        let email = sessionClaims.email ||
            sessionClaims.primary_email_address ||
            sessionClaims.primaryEmail ||
            sessionClaims['https://clerk.dev/email'] ||
            sessionClaims['https://clerk.dev/primary_email_address'] ||
            null;

        if (!email && sessionClaims.email_addresses && Array.isArray(sessionClaims.email_addresses)) {
            const firstEmail = sessionClaims.email_addresses[0];
            email = typeof firstEmail === 'string' ? firstEmail :
                (firstEmail?.email_address || firstEmail?.emailAddress || firstEmail);
        }

        // Lay email theo thu tu uu tien de tranh thieu du lieu.
        if (!email && sessionClaims.primary_email_address_id && sessionClaims.email_addresses) {
            const primaryEmailObj = sessionClaims.email_addresses.find(
                e => (typeof e === 'object' && (e.id === sessionClaims.primary_email_address_id || e.email_address_id === sessionClaims.primary_email_address_id))
            );
            if (primaryEmailObj) {
                email = primaryEmailObj.email_address || primaryEmailObj.emailAddress || primaryEmailObj;
            }
        }

        if (email && typeof email === 'object') {
            email = email.email_address || email.emailAddress || email;
        }

        let name = sessionClaims.name ||
            sessionClaims.first_name ||
            sessionClaims.firstName ||
            sessionClaims['https://clerk.dev/first_name'] ||
            sessionClaims.username ||
            null;

        if (name && typeof name === 'object') {
            name = name.first_name || name.firstName || name.name || name;
        }

        if (!name && email) {
            name = email.split('@')[0];
        } else if (!name) {
            name = 'User';
        }

        // Neu chua co email thi tao user voi email tam.
        if (!email) {
            const tempEmail = `temp_${clerkId}@pending.clerk`;

            let user = await db.User.findOne({ clerkId });

            if (!user) {
                user = await db.User.create({
                    clerkId,
                    name: name || 'User',
                    email: tempEmail,
                    role: 'user'
                });
            }

            return res.status(200).send({
                message: 'dong bo user thanh cong voi email tam',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    clerkId: user.clerkId
                },
                created: false
            });
        }

        const isAdmin = env.adminEmails.includes(email);

        let user = await db.User.findOne({ clerkId });
        let created = false;

        if (!user) {
            user = await db.User.create({
                clerkId,
                name,
                email,
                role: isAdmin ? 'admin' : 'user'
            });
            created = true;
        } else {
            // Update existing user if needed
            let updated = false;
            if (user.email !== email) {
                user.email = email;
                updated = true;
            }
            if (isAdmin && user.role !== 'admin') {
                user.role = 'admin';
                updated = true;
            }
            if (updated) await user.save();
        }

        return res.status(200).send({
            message: 'dong bo user thanh cong',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                clerkId: user.clerkId
            },
            created
        });
    } catch (e) {
        return next(e);
    }
});

export default router;
