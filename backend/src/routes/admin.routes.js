import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { getAdminStats } from '../controllers/admin.controller.js';

const router = Router();

router.get('/stats', clerkAuth, requireRole('admin'), getAdminStats);

export default router;
