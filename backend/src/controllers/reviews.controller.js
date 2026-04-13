import db from '../models/index.js';

const normalizeServiceFromBooking = (booking) => {
  if (booking.hotel_id) return { service_type: 'hotel', service_id: booking.hotel_id };
  if (booking.flight_id) return { service_type: 'flight', service_id: booking.flight_id };
  if (booking.car_id) return { service_type: 'car', service_id: booking.car_id };
  if (booking.activity_id) return { service_type: 'activity', service_id: booking.activity_id };
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

    const rows = await db.Review.findAll({
      where: {
        service_type,
        service_id: Number(service_id),
        status: 'approved'
      },
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const items = rows.map(r => r.toJSON());
    const count = items.length;
    const average_rating = count ? Number((items.reduce((sum, it) => sum + Number(it.rating || 0), 0) / count).toFixed(2)) : 0;

    res.json({ items, count, average_rating });
  } catch (e) {
    next(e);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { booking_id, rating, comment } = req.body || {};

    const numericRating = Number(rating);
    if (!booking_id || !Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'booking_id and rating (1-5) are required' });
    }

    const booking = await db.Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });
    if (booking.status !== 'completed') return res.status(400).json({ error: 'Only completed bookings can be reviewed' });

    const service = normalizeServiceFromBooking(booking);
    if (!service) return res.status(400).json({ error: 'Booking has no service to review' });

    const existing = await db.Review.findOne({ where: { booking_id: booking.id } });
    if (existing) return res.status(409).json({ error: 'Review already exists for this booking' });

    const created = await db.Review.create({
      booking_id: booking.id,
      user_id: userId,
      service_type: service.service_type,
      service_id: service.service_id,
      rating: numericRating,
      comment: comment ? String(comment) : null,
      status: 'pending'
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

export const adminListReviews = async (req, res, next) => {
  try {
    const { status, service_type, service_id } = req.query;
    const where = {};

    if (status && ['pending', 'approved', 'hidden'].includes(status)) where.status = status;
    if (service_type && ['hotel', 'flight', 'car', 'activity'].includes(service_type)) where.service_type = service_type;
    if (service_id) where.service_id = Number(service_id);

    const rows = await db.Review.findAll({
      where,
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: db.Booking, as: 'booking' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ items: rows.map((r) => r.toJSON()) });
  } catch (e) {
    next(e);
  }
};

export const adminUpdateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await db.Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Not found' });

    await review.update({ status });
    res.json(review);
  } catch (e) {
    next(e);
  }
};

export const adminDeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await db.Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Not found' });

    await review.destroy();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
