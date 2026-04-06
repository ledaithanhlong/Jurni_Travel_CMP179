import db from '../models/index.js';

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const payload = { ...req.body, user_id: userId };
    const created = await db.Booking.create(payload);
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const row = await db.Booking.findByPk(req.params.id, {
      include: [
        { model: db.Hotel, as: 'hotel' },
        { model: db.Flight, as: 'flight' },
        { model: db.Car, as: 'car' },
        { model: db.Activity, as: 'activity' },
        { model: db.User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (req.user?.role !== 'admin' && row.user_id !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const booking = row.toJSON();
    booking.service = booking.hotel || booking.flight || booking.car || booking.activity || {};

    if (booking.hotel) booking.service_type = 'hotel';
    else if (booking.flight) booking.service_type = 'flight';
    else if (booking.car) booking.service_type = 'car';
    else if (booking.activity) booking.service_type = 'activity';

    return res.json(booking);
  } catch (e) {
    return next(e);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const whereClause = userRole === 'admin' ? {} : { user_id: userId };

    const rows = await db.Booking.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.Hotel, as: 'hotel' },
        { model: db.Flight, as: 'flight' },
        { model: db.Car, as: 'car' },
        { model: db.Activity, as: 'activity' },
        ...(userRole === 'admin' ? [{ model: db.User, as: 'user', attributes: ['id', 'name', 'email'] }] : []),
      ],
    });

    const bookings = rows.map((r) => {
      const b = r.toJSON();
      b.service = b.hotel || b.flight || b.car || b.activity || {};

      if (b.hotel) b.service_type = 'hotel';
      else if (b.flight) b.service_type = 'flight';
      else if (b.car) b.service_type = 'car';
      else if (b.activity) b.service_type = 'activity';

      return b;
    });

    return res.json(bookings);
  } catch (e) {
    return next(e);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await db.Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    return res.json(booking);
  } catch (e) {
    return next(e);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await db.Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete bookings' });
    }

    await booking.destroy();
    return res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (e) {
    return next(e);
  }
};


