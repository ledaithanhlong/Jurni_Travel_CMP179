const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// This middleware checks for a valid Clerk JWT in the request headers (Authorization: Bearer <token>)
exports.requireAuth = ClerkExpressRequireAuth({});

exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;
      const user = await User.findOne({ clerkId });

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      }

      req.user = user; // Attach DB user object to request
      next();
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
};
