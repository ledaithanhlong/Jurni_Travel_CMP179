import { Router } from 'express';
import { getPaymentConfig, processPayment } from '../controllers/payments.controller.js';
import { clerkAuth, syncUser } from '../middlewares/auth.js';

const router = Router();

router.get('/config', getPaymentConfig);
router.post('/checkout', clerkAuth, syncUser, processPayment);

export default router;
