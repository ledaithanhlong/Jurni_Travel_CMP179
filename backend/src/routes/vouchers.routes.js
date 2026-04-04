import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listVouchers, getAllVouchers, createVoucher, updateVoucher, deleteVoucher } from '../controllers/vouchers.controller.js';

const router = Router();
router.get('/', listVouchers);
router.get('/all', clerkAuth, requireRole('admin'), getAllVouchers);
router.post('/', clerkAuth, requireRole('admin'), createVoucher);
router.put('/:id', clerkAuth, requireRole('admin'), updateVoucher);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteVoucher);
export default router;


