import { Router } from 'express';
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonials.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), listTestimonials);

// Admin
router.post('/', clerkAuth, requireRole('admin'), createTestimonial);
router.put('/:id', clerkAuth, requireRole('admin'), updateTestimonial);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteTestimonial);

export default router;
