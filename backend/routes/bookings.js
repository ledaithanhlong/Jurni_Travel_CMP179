const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// Protected routes for users
router.post('/', requireAuth, bookingController.createBooking);
router.get('/my-bookings', requireAuth, (req, res, next) => {
  // Reuse getBookingHistory from userController
  const userController = require('../controllers/userController');
  userController.getBookingHistory(req, res, next);
});

// Admin routes
router.get('/', requireAuth, authorize('admin'), bookingController.getAllBookings);
router.get('/:id', requireAuth, authorize('admin'), bookingController.getBookingById);
router.patch('/:id', requireAuth, authorize('admin'), bookingController.updateBookingStatus);
router.delete('/:id', requireAuth, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
