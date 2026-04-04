import { Router } from 'express';
import { listCareerValues, createCareerValue, updateCareerValue, deleteCareerValue } from '../controllers/careerValues.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listCareerValues);

// Admin only routes
router.post('/', clerkAuth, requireRole('admin'), createCareerValue);
router.put('/:id', clerkAuth, requireRole('admin'), updateCareerValue);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteCareerValue);

export default router;
