const Notification = require('../models/Notification');
const User = require('../models/User');

// Get my notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    const notifications = await Notification.find({ userId: user._id }).sort('-createdAt');
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create notification (internal helper)
exports.createNotification = async (userId, title, message, type, actionUrl, req) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      actionUrl
    });

    // Emit socket event
    const io = req.app.get('socketio');
    if (io) {
      io.emit(`notification:${userId}`, notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Send broadcast notification (for Promotions)
exports.sendBroadcastNotification = async (req, res) => {
  try {
    const { title, message, actionUrl } = req.body;
    const users = await User.find({}, '_id');

    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: 'promotion',
      actionUrl
    }));

    await Notification.insertMany(notifications);

    const io = req.app.get('socketio');
    if (io) {
      io.emit('promotion', { title, message, actionUrl });
    }

    res.json({ success: true, message: 'Broadcast notification sent to all users' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
