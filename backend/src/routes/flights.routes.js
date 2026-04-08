import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listFlights, createFlight, createBulkFlights, updateFlight, deleteFlight } from '../controllers/flights.controller.js';

const router = Router();
router.get('/', listFlights);
router.post('/', clerkAuth, requireRole('admin'), createFlight);
router.post('/bulk', clerkAuth, requireRole('admin'), createBulkFlights);
router.put('/:id', clerkAuth, requireRole('admin'), updateFlight);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteFlight);
export default router;


