import db from '../models/index.js';

const normalizeServiceFromBooking = (booking) => {
    if (booking?.hotel_id) return { service_type: 'hotel', service_id: booking.hotel_id };
    if (booking?.flight_id) return { service_type: 'flight', service_id: booking.flight_id };
    if (booking?.car_id) return { service_type: 'car', service_id: booking.car_id };
    if (booking?.activity_id) return { service_type: 'activity', service_id: booking.activity_id };
    return null;
};

export const listReviews = async (req, res, next) => {
    try {
        const { service_type, service_id } = req.query;
        if (!service_type || !service_id) {
            return res.status(400).json({ error: 'service_type and service_id are required' });
        }

        if (!['hotel', 'flight', 'car', 'activity'].includes(service_type)) {
            return res.status(400).json({ error: 'Invalid service_type' });
        }

        const rows = await db.Review.find({
            service_type,
            service_id: String(service_id),
            status: 'approved',
        })
            .sort({ createdAt: -1 })
            .populate('user_id', 'id name email');

        const items = rows.map((r) => {
            const it = r.toObject({ virtuals: true });
            it.user = it.user_id;
            delete it.user_id;
            return it;
        });

        const count = items.length;
        const average_rating = count
            ? Number((items.reduce((sum, it) => sum + Number(it.rating || 0), 0) / count).toFixed(2))
            : 0;

        return res.json({ items, count, average_rating });
    } catch (e) {
        return next(e);
    }
};

export const createReview = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { booking_id, rating, comment } = req.body || {};

        const numericRating = Number(rating);
        if (!booking_id || !Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ error: 'booking_id and rating (1-5) are required' });
        }

        const booking = await db.Booking.findById(String(booking_id));
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (String(booking.user_id) !== String(userId)) return res.status(403).json({ error: 'Forbidden' });
        if (booking.status !== 'completed') return res.status(400).json({ error: 'Only completed bookings can be reviewed' });

        const service = normalizeServiceFromBooking(booking);
        if (!service) return res.status(400).json({ error: 'Booking has no service to review' });

        const existing = await db.Review.findOne({ booking_id: String(booking._id) });
        if (existing) return res.status(409).json({ error: 'Review already exists for this booking' });

        const created = await db.Review.create({
            booking_id: String(booking._id),
            user_id: String(userId),
            service_type: service.service_type,
            service_id: String(service.service_id),
            rating: numericRating,
            comment: comment ? String(comment) : null,
            status: 'pending',
        });

        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const adminListReviews = async (req, res, next) => {
    try {
        const { status, service_type, service_id } = req.query;
        const where = {};

        if (status && ['pending', 'approved', 'hidden'].includes(status)) where.status = status;
        if (service_type && ['hotel', 'flight', 'car', 'activity'].includes(service_type)) where.service_type = service_type;
        if (service_id) where.service_id = String(service_id);

        const rows = await db.Review.find(where)
            .sort({ createdAt: -1 })
            .populate('user_id', 'id name email')
            .lean();

        const items = rows.map((r) => ({
            ...r,
            id: r._id,
            user: r.user_id,
        }));

        return res.json({ items });
    } catch (e) {
        return next(e);
    }
};

export const adminUpdateReviewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};

        if (!['pending', 'approved', 'hidden'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const review = await db.Review.findById(id);
        if (!review) return res.status(404).json({ error: 'Not found' });

        review.status = status;
        await review.save();

        return res.json(review);
    } catch (e) {
        return next(e);
    }
};

export const adminDeleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await db.Review.findByIdAndDelete(id);
        if (!review) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
