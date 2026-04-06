const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

router.post('/', requireAuth, bookingController.createBooking);
router.get('/', requireAuth, authorize('admin'), bookingController.getAllBookings);
router.get('/:id', requireAuth, bookingController.getBookingById);
router.put('/:id/status', requireAuth, authorize('admin'), bookingController.updateBookingStatus);
router.delete('/:id', requireAuth, authorize('admin'), bookingController.deleteBooking);

module.exports = router;

