import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listUsers, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = Router();
router.get('/', clerkAuth, requireRole('admin'), listUsers);
router.put('/:id', clerkAuth, requireRole('admin'), updateUser);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteUser);
export default router;

