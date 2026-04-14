import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';

const router = Router();

// Cache GET category list for 5 minutes
router.get('/', cacheMiddleware(300), listCategories);
router.post('/', clerkAuth, requireRole('admin'), createCategory);
router.put('/:id', clerkAuth, requireRole('admin'), updateCategory);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteCategory);

export default router;
