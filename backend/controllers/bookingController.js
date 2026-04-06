const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const mongoose = require('mongoose');

const isTransactionNotSupportedError = (error) => {
  const msg = String(error?.message || '');
  return msg.includes('Transaction numbers are only allowed') || msg.includes('replica set member') || msg.includes('mongos');
};

// Create Booking with Mongoose Transaction for data integrity
exports.createBooking = async (req, res) => {
  try {
    const { tourId, guests, totalPrice } = req.body;
    const clerkId = req.auth.userId;

    const run = async (session) => {
      const userQuery = User.findOne({ clerkId });
      const user = session ? await userQuery.session(session) : await userQuery;
      if (!user) throw new Error('User not found');

      const tourQuery = Tour.findById(tourId);
      const tour = session ? await tourQuery.session(session) : await tourQuery;
      if (!tour) throw new Error('Tour not found');
      if (tour.availableSlots < guests) throw new Error('Not enough slots available');

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

      if (session) {
        await booking.save({ session });
      } else {
        await booking.save();
      }

      tour.availableSlots -= guests;
      if (session) {
        await tour.save({ session });
      } else {
        await tour.save();
      }

      return { booking, tour, user };
    };

    let result = null;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      result = await run(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction().catch(() => {});
      if (isTransactionNotSupportedError(error)) {
        result = await run(null);
      } else {
        throw error;
      }
    } finally {
      session.endSession();
    }

    res.status(201).json({ success: true, data: result.booking });
  } catch (error) {
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
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('tourId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Notify user about status update
    await notificationController.createNotification(
      booking.userId,
      'Cập nhật trạng thái đơn hàng',
      `Đơn hàng cho tour ${booking.tourId.title} đã chuyển sang trạng thái: ${status}.`,
      'order_status',
      `/bookings/${booking._id}`,
      req
    );

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
