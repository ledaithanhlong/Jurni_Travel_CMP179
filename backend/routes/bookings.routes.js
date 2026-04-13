import { Router } from 'express';
import { createBooking, deleteBooking, getAllBookings, getBooking, updateBooking } from '../controllers/bookings.controller.js';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';

const router = Router();
router.post('/', clerkAuth, requireAuth, createBooking);
router.get('/', clerkAuth, requireAuth, getAllBookings);
router.get('/:id', clerkAuth, requireAuth, getBooking);
router.patch('/:id', clerkAuth, requireAuth, updateBooking);
router.delete('/:id', clerkAuth, requireAuth, deleteBooking);
export default router;


