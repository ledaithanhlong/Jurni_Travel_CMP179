import { clerkMiddleware, getAuth, requireAuth as clerkRequireAuth } from '@clerk/express';
import { env } from '../config/env.js';
import db from '../models/index.js';

// Configure Clerk middleware
// Clerk Express automatically reads CLERK_SECRET_KEY from environment variables
// But we can also pass it explicitly
export const clerkAuth = env.clerk.secretKey
  ? clerkMiddleware({ secretKey: env.clerk.secretKey })
  : clerkMiddleware();


export const syncUser = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return next(); // No clerk user, no DB user

    // Try to find user in DB
    let user = await db.User.findOne({ where: { clerkId: auth.userId } });

    // Assuming sync happens via /api/users/sync or previous login. 
    // However, for robustness, if user is missing but we have token, we can create basic user or just return null.
    // Ideally, frontend calls /sync. Here we just try to populate req.user if found.

    if (user) {
      req.user = user;
    } else {
      console.log('syncUser: User not found in DB for clerkId', auth.userId);
    }
    next();
  } catch (e) {
    console.error('syncUser error:', e);
    next(e);
  }
};

export const requireAuth = [clerkRequireAuth(), syncUser];

export const requireRole = (role) => async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      console.log('requireRole: No userId in auth');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkId = auth.userId;
    console.log('requireRole: Checking role for clerkId:', clerkId);

    // Tìm user trong database
    let user = await db.User.findOne({ where: { clerkId } });

    // Lấy email từ user hoặc session claims
    let email = user?.email;
    if (!email && auth.sessionClaims) {
      // Thử lấy email từ session claims
      email = auth.sessionClaims.email ||
        auth.sessionClaims.primary_email_address ||
        (auth.sessionClaims.email_addresses && Array.isArray(auth.sessionClaims.email_addresses)
          ? auth.sessionClaims.email_addresses[0]?.email_address || auth.sessionClaims.email_addresses[0]
          : null);
    }

    console.log('requireRole: User found:', !!user, 'Email:', email, 'User role:', user?.role);
    console.log('requireRole: Admin emails:', env.adminEmails);

    // Kiểm tra xem email có trong danh sách admin không
    const isAdminByEmail = email && env.adminEmails.includes(email);
    console.log('requireRole: Is admin by email:', isAdminByEmail);

    // Nếu user chưa có trong DB nhưng email là admin, tạo user với role admin
    if (!user && isAdminByEmail) {
      console.log('requireRole: Creating admin user in DB');
      user = await db.User.create({
        clerkId,
        name: auth.sessionClaims?.name || email?.split('@')[0] || 'Admin',
        email: email,
        role: 'admin'
      });
    }

    // Nếu user có trong DB nhưng role không đúng và email là admin, cập nhật role
    if (user && isAdminByEmail && user.role !== 'admin') {
      console.log('requireRole: Updating user role to admin');
      await user.update({ role: 'admin' });
      user.role = 'admin';
    }

    // Xác định role cuối cùng
    const roleValue = user?.role || (isAdminByEmail ? 'admin' : 'user');
    console.log('requireRole: Final role value:', roleValue, 'Required role:', role);

    // Kiểm tra quyền
    if (role === 'admin' && roleValue !== 'admin') {
      console.log('requireRole: Access denied - user is not admin');
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
        userRole: roleValue,
        userEmail: email
      });
    }

    req.user = user || null;
    console.log('requireRole: Access granted');
    return next();
  } catch (e) {
    console.error('requireRole error:', e);
    return next(e);
  }
};

