import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import { getPaymentConfig, processPayment } from '../controllers/payments.controller.js';

const router = Router();

router.get('/config', clerkAuth, getPaymentConfig);
router.post('/checkout', clerkAuth, requireAuth, processPayment);

export default router;


