const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, authorize } = require('../middlewares/auth');

// Admin stats (Requires authentication and admin role)
router.get('/stats', requireAuth, authorize('admin'), adminController.getStats);

module.exports = router;
