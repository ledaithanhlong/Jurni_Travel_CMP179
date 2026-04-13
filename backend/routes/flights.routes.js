import { Router } from 'express';
import { createFlight, deleteFlight, getFlight, listFlights, updateFlight } from '../controllers/flights.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listFlights);
router.get('/:id', getFlight);
router.post('/', clerkAuth, requireRole('admin'), createFlight);
router.put('/:id', clerkAuth, requireRole('admin'), updateFlight);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteFlight);

export default router;
