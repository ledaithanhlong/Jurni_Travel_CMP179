const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const [users, tours, bookings] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        users,
        tours,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

