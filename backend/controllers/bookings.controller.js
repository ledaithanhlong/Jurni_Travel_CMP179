import db from '../models/index.js';

const normalizeBookingForFrontend = (bookingDoc, reviewDoc) => {
    const b = bookingDoc?.toObject ? bookingDoc.toObject({ virtuals: true }) : bookingDoc;

    const hotel = b.hotel_id && typeof b.hotel_id === 'object' ? b.hotel_id : null;
    const flight = b.flight_id && typeof b.flight_id === 'object' ? b.flight_id : null;
    const car = b.car_id && typeof b.car_id === 'object' ? b.car_id : null;
    const activity = b.activity_id && typeof b.activity_id === 'object' ? b.activity_id : null;

    let service_type = null;
    let service_id = null;
    let service = {};

    if (hotel) {
        service_type = 'hotel';
        service_id = hotel._id || hotel.id;
        service = hotel;
    } else if (flight) {
        service_type = 'flight';
        service_id = flight._id || flight.id;
        service = flight;
    } else if (car) {
        service_type = 'car';
        service_id = car._id || car.id;
        service = car;
    } else if (activity) {
        service_type = 'activity';
        service_id = activity._id || activity.id;
        service = activity;
    }

    const review = reviewDoc
        ? (reviewDoc.toObject ? reviewDoc.toObject({ virtuals: true }) : reviewDoc)
        : null;

    return {
        ...b,
        service_type,
        service_id,
        service,
        review,
    };
};

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

        const review = await db.Review.findOne({ booking_id: String(row._id) });
        return res.json(normalizeBookingForFrontend(row, review));
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

        const bookingIds = rows.map((b) => String(b._id));
        const reviews = await db.Review.find({ booking_id: { $in: bookingIds } }).lean();
        const reviewByBookingId = new Map(reviews.map((r) => [String(r.booking_id), r]));

        const normalized = rows.map((b) => normalizeBookingForFrontend(b, reviewByBookingId.get(String(b._id)) || null));
        return res.json(normalized);
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
