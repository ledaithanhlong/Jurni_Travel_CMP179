import { Router } from 'express';
import { env } from '../config/env.js';
import {
	createUser,
	deleteUser,
	getMyProfile,
	getUserById,
	listUsers,
	updateUser,
} from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();
const adminGuards = env.clerk?.secretKey ? [...requireAuth, requireRole('admin')] : [];

router.get('/', listUsers);
router.get('/me', requireAuth, getMyProfile);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', ...adminGuards, updateUser);
router.delete('/:id', ...adminGuards, deleteUser);

export default router;
