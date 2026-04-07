import db from '../models/index.js';

export const sendNotification = async (req, res, next) => {
    try {
        const { userId, title, message, actionUrl, type, broadcast } = req.body;

        if (broadcast) {
            const users = await db.User.find({}, '_id');
            const notifications = await Promise.all(
                users.map((user) =>
                    db.Notification.create({
                        user_id: user._id,
                        title,
                        message,
                        action_url: actionUrl,
                        type: type || 'system',
                    })
                )
            );

            return res.status(201).json({
                message: `Đã gửi ${notifications.length} thông báo`,
                count: notifications.length,
            });
        }

        const created = await db.Notification.create({
            user_id: userId,
            title,
            message,
            action_url: actionUrl,
            type: type || 'system',
        });
        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const listNotifications = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'Chưa đăng nhập' });
        }
        const rows = await db.Notification.find({ user_id: req.user._id }).sort({ createdAt: -1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await db.Notification.findOne({ _id: id, user_id: req.user._id });
        if (!notification) {
            return res.status(404).json({ error: 'Không tìm thấy thông báo' });
        }

        notification.is_read = true;
        await notification.save();
        return res.json({ message: 'Đã đánh dấu đã đọc' });
    } catch (e) {
        return next(e);
    }
};

export const getUnreadCount = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'Chưa đăng nhập' });
        }
        const count = await db.Notification.countDocuments({
            user_id: req.user._id,
            is_read: false,
        });
        return res.json({ count });
    } catch (e) {
        return next(e);
    }
};
