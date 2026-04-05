const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, authorize } = require('../middlewares/auth');

// Public routes
router.post('/sync', userController.syncClerkUser);

// Protected routes
router.get('/me', requireAuth, userController.getCurrentUser);
router.put('/me', requireAuth, userController.updateCurrentUser);
router.get('/me/bookings', requireAuth, userController.getBookingHistory);

// Admin / CRUD routes
router.get('/', requireAuth, authorize('admin'), userController.getAllUsers);
router.get('/:id', requireAuth, authorize('admin'), userController.getUserById);
router.put('/:id', requireAuth, authorize('admin'), userController.updateUser);
router.delete('/:id', requireAuth, authorize('admin'), userController.deleteUser);

module.exports = router;
