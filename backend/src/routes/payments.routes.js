import { Router } from 'express';
import { clerkAuth } from '../middlewares/auth.js';
import { getPaymentConfig, processPayment } from '../controllers/payments.controller.js';

const router = Router();

router.get('/config', clerkAuth, getPaymentConfig);
router.post('/checkout', clerkAuth, processPayment);

export default router;


