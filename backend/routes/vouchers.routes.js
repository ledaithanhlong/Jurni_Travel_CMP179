import { Router } from 'express';
import { createVoucher, deleteVoucher, getAllVouchers, listVouchers, updateVoucher } from '../controllers/vouchers.controller.js';
import { requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listVouchers);
router.get('/all', requireRole('admin'), getAllVouchers);
router.post('/', requireRole('admin'), createVoucher);
router.put('/:id', requireRole('admin'), updateVoucher);
router.delete('/:id', requireRole('admin'), deleteVoucher);

export default router;


