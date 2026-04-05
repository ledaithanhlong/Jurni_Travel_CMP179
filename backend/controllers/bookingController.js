const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create Booking with Mongoose Transaction for data integrity
exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tourId, guests, totalPrice } = req.body;
    const clerkId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId }).session(session);
    if (!user) throw new Error('User not found');

    // Find tour and check availability
    const tour = await Tour.findById(tourId).session(session);
    if (!tour) throw new Error('Tour not found');
    if (tour.availableSlots < guests) throw new Error('Not enough slots available');

    // Create booking
    const booking = new Booking({
      userId: user._id,
      clerkId,
      tourId,
      guests,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'paid', 
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
    });

    await booking.save({ session });

    // Update tour availability
    tour.availableSlots -= guests;
    await tour.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Notify via Socket.io
    if (req.app.get('socketio')) {
      req.app.get('socketio').emit('bookingSuccess', {
        message: `Booking successful for ${tour.title}`,
        bookingId: booking._id
      });
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId').populate('tourId');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId').populate('tourId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
