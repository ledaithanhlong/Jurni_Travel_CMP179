const User = require('../models/User');

const authorize = (role) => {
  return async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;
      if (!clerkId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(403).json({ success: false, message: 'Forbidden' });

      if (user.role !== role) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

module.exports = { authorize };

