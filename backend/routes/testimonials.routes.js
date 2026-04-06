import { Router } from 'express';
import { createTestimonial, deleteTestimonial, listTestimonials, updateTestimonial } from '../controllers/testimonials.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listTestimonials);
router.post('/', clerkAuth, requireRole('admin'), createTestimonial);
router.put('/:id', clerkAuth, requireRole('admin'), updateTestimonial);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteTestimonial);

export default router;
