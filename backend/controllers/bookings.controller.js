import db from '../models/index.js';

export const createBooking = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const payload = { ...req.body, user_id: userId };
        const created = await db.Booking.create(payload);

        // Send notification for successful booking
        await db.Notification.create({
            user_id: userId,
            title: 'Đặt tour thành công',
            message: `Bạn đã đặt tour thành công. Mã đơn hàng: ${created._id}.`,
            type: 'booking',
            action_url: `/bookings/${created._id}`,
        });

        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const getBooking = async (req, res, next) => {
    try {
        const row = await db.Booking.findById(req.params.id)
            .populate('user_id', 'id name email')
            .populate('hotel_id')
            .populate('flight_id')
            .populate('car_id')
            .populate('activity_id');

        if (!row) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (req.user?.role !== 'admin' && row.user_id?.toString() !== req.user?._id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;

        const whereClause = userRole === 'admin' ? {} : { user_id: userId };

        const rows = await db.Booking.find(whereClause)
            .sort({ createdAt: -1 })
            .populate(userRole === 'admin' ? { path: 'user_id', select: 'id name email' } : '')
            .populate('hotel_id')
            .populate('flight_id')
            .populate('car_id')
            .populate('activity_id');

        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await db.Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Send notification for status update
        if (oldStatus !== status) {
            await db.Notification.create({
                user_id: booking.user_id,
                title: 'Cập nhật trạng thái đơn hàng',
                message: `Đơn hàng ${booking._id} của bạn đã được cập nhật sang trạng thái: ${status}.`,
                type: 'order_status',
                action_url: `/bookings/${booking._id}`,
            });
        }

        return res.json(booking);
    } catch (e) {
        return next(e);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const row = await db.Booking.findByIdAndDelete(id);
        if (!row) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
