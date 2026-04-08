import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activities.controller.js';

const router = Router();
router.get('/', listActivities);
router.post('/', clerkAuth, requireRole('admin'), createActivity);
router.put('/:id', clerkAuth, requireRole('admin'), updateActivity);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteActivity);
export default router;


