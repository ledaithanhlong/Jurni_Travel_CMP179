const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middlewares/auth');

router.get('/me', requireAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;

