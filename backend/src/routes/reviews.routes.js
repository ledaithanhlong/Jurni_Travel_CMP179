import { Router } from 'express';
import { clerkAuth, requireAuth, requireRole } from '../middlewares/auth.js';
import { listReviews, createReview, adminListReviews, adminUpdateReviewStatus, adminDeleteReview } from '../controllers/reviews.controller.js';

const router = Router();

router.get('/', listReviews);
router.post('/', clerkAuth, requireAuth, createReview);

router.get('/admin', clerkAuth, requireRole('admin'), adminListReviews);
router.patch('/:id/status', clerkAuth, requireRole('admin'), adminUpdateReviewStatus);
router.delete('/:id', clerkAuth, requireRole('admin'), adminDeleteReview);

export default router;

