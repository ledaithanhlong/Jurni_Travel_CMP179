import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';

const router = Router();

router.get('/', listCategories);
router.post('/', clerkAuth, requireRole('admin'), createCategory);
router.put('/:id', clerkAuth, requireRole('admin'), updateCategory);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteCategory);

export default router;
