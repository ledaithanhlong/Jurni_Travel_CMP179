import { Router } from 'express';
import { createVoucher, deleteVoucher, getAllVouchers, listVouchers, updateVoucher } from '../controllers/vouchers.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listVouchers);
router.get('/all', clerkAuth, requireRole('admin'), getAllVouchers);
router.post('/', clerkAuth, requireRole('admin'), createVoucher);
router.put('/:id', clerkAuth, requireRole('admin'), updateVoucher);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteVoucher);

export default router;


