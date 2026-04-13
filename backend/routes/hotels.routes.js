import { Router } from 'express';
import { createHotel, deleteHotel, getHotel, listHotels, updateHotel } from '../controllers/hotels.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listHotels);
router.get('/:id', getHotel);
router.post('/', clerkAuth, requireRole('admin'), createHotel);
router.put('/:id', clerkAuth, requireRole('admin'), updateHotel);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteHotel);

export default router;
