const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// Admin stats (Requires authentication and admin role)
router.get('/stats', requireAuth, authorize('admin'), adminController.getStats);

module.exports = router;
