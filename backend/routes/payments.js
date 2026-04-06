const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middlewares/auth');

router.post('/checkout', requireAuth, paymentController.checkout);

module.exports = router;

