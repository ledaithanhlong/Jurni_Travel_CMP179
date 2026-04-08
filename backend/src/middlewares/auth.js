import { clerkMiddleware, requireAuth as clerkRequireAuth, getAuth } from '@clerk/express';
import { env } from '../config/env.js';
import db from '../models/index.js';

// Khởi tạo Clerk middleware với secret key từ environment
export const clerkAuth = clerkMiddleware({
  publishableKey: env.clerk.publishableKey,
  secretKey: env.clerk.secretKey
});


export const syncUser = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return next();

    // Tìm user trong database và không bị disable
    let user = await db.User.findOne({ 
      where: { 
        clerkId: auth.userId, 
        isDisable: false 
      } 
    });

    if (user) {
      req.user = user;
      console.log('syncUser: User found with role:', user.role);
    } else {
      console.log('syncUser: User not found or disabled for clerkId:', auth.userId);
    }
    
    next();
  } catch (e) {
    console.error('syncUser error:', e);
    next(e);
  }
};

/**
 * Middleware để kiểm tra user có bị disable không
 */
export const checkUserActive = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return next();

    const user = await db.User.findOne({ where: { clerkId: auth.userId } });
    
    if (user && user.isDisable) {
      return res.status(403).json({
        error: 'Account Disabled',
        message: 'Tài khoản của bạn đã bị vô hiệu hóa. Liên hệ admin để biết thêm chi tiết.'
      });
    }
    
    next();
  } catch (e) {
    console.error('checkUserActive error:', e);
    next(e);
  }
};

export const requireAuth = [clerkRequireAuth(), checkUserActive, syncUser];

export const requireRole = (role) => async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      console.log('requireRole: No userId in auth');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkId = auth.userId;
    console.log('requireRole: Checking role for clerkId:', clerkId);

    // Tìm user trong database - QUYỀN ƯU TIÊN TUYỆT ĐỐI
    let user = await db.User.findOne({ where: { clerkId, isDisable: false } });

    if (user) {
      // Nếu user đã tồn tại trong DB và không bị disable
      console.log('requireRole: User found in DB with role:', user.role);
      
      // DATABASE ROLE LÀ CHÍNH THỨC - không được override
      const dbRole = user.role;
      
      // Kiểm tra quyền dựa vào database role
      if (role === 'admin' && dbRole !== 'admin') {
        console.log('requireRole: Access denied - user role in DB is not admin');
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required',
          userRole: dbRole,
          userEmail: user.email,
          note: 'Role được quản lý trong database'
        });
      }

      req.user = user;
      console.log('requireRole: Access granted based on DB role');
      return next();
      
    } else {
      // User chưa có trong DB - tạo user mới
      console.log('requireRole: User not found in DB, creating new user');
      
      // Lấy email từ Clerk claims
      let email = null;
      if (auth.sessionClaims) {
        email = auth.sessionClaims.email ||
          auth.sessionClaims.primary_email_address ||
          (auth.sessionClaims.email_addresses && Array.isArray(auth.sessionClaims.email_addresses)
            ? auth.sessionClaims.email_addresses[0]?.email_address || auth.sessionClaims.email_addresses[0]
            : null);
      }

      if (!email) {
        console.log('requireRole: Cannot determine email for new user');
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Cannot determine user email' 
        });
      }

      // Xác định role cho user mới dựa vào env (chỉ dành cho user mới)
      const isAdminByEmail = env.adminEmails.includes(email);
      const initialRole = isAdminByEmail ? 'admin' : 'user';
      
      console.log('requireRole: Creating user with initial role:', initialRole, 'for email:', email);
      
      try {
        user = await db.User.create({
          clerkId,
          name: auth.sessionClaims?.name || auth.sessionClaims?.full_name || email.split('@')[0] || 'User',
          email: email,
          role: initialRole
        });

        console.log('requireRole: New user created with role:', user.role);
        
        // Kiểm tra quyền cho user mới tạo
        if (role === 'admin' && user.role !== 'admin') {
          console.log('requireRole: Access denied - new user is not admin');
          return res.status(403).json({
            error: 'Forbidden',
            message: 'Admin access required',
            userRole: user.role,
            userEmail: user.email
          });
        }

        req.user = user;
        console.log('requireRole: Access granted for new user');
        return next();
        
      } catch (createError) {
        console.error('requireRole: Error creating user:', createError);
        
        // Có thể user đã được tạo trong lúc đó (race condition)
        user = await db.User.findOne({ where: { clerkId } });
        if (user) {
          // Kiểm tra lại quyền với user vừa tìm thấy
          if (role === 'admin' && user.role !== 'admin') {
            return res.status(403).json({
              error: 'Forbidden',
              message: 'Admin access required',
              userRole: user.role,
              userEmail: user.email
            });
          }
          req.user = user;
          return next();
        }
        
        throw createError;
      }
    }
  } catch (e) {
    console.error('requireRole error:', e);
    return next(e);
  }
};

