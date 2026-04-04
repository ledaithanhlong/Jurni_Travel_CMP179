import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listHotels, listAllHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotels.controller.js';

const router = Router();

router.get('/', listHotels);
router.get('/admin/all', clerkAuth, requireRole('admin'), listAllHotels);
router.get('/:id', getHotel);
router.post('/', clerkAuth, requireRole('admin'), createHotel);
router.put('/:id', clerkAuth, requireRole('admin'), updateHotel);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteHotel);

export default router;


