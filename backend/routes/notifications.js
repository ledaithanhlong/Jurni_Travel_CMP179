const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middlewares/auth');

router.get('/my', requireAuth, notificationController.getMyNotifications);
router.put('/:id/read', requireAuth, notificationController.markAsRead);

module.exports = router;
