import db from '../models/index.js';

export const sendNotification = async (req, res, next) => {
  try {
    const { user_id, title, message, action_url, broadcast } = req.body;

    if (broadcast) {
      const users = await db.User.findAll({ attributes: ['id'] });
      const notifications = await Promise.all(
        users.map((user) =>
          db.Notification.create({
            user_id: user.id,
            title,
            message,
            action_url,
          })
        )
      );

      return res.status(201).json({
        message: `Đã gửi ${notifications.length} thông báo`,
        count: notifications.length,
      });
    }

    const created = await db.Notification.create({ user_id, title, message, action_url });
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
};

export const listNotifications = async (req, res, next) => {
  try {
    const rows = await db.Notification.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await db.Notification.findOne({ where: { id, user_id: req.user.id } });
    if (!notification) {
      return res.status(404).json({ error: 'Không tìm thấy thông báo' });
    }

    await notification.update({ is_read: true });
    return res.json({ message: 'Đã đánh dấu đã đọc' });
  } catch (e) {
    return next(e);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await db.Notification.count({
      where: { user_id: req.user.id, is_read: false },
    });
    return res.json({ count });
  } catch (e) {
    return next(e);
  }
};


