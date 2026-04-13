import { Router } from 'express';
import { createActivity, deleteActivity, getActivity, listActivities, updateActivity } from '../controllers/activities.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listActivities);
router.get('/:id', getActivity);
router.post('/', clerkAuth, requireRole('admin'), createActivity);
router.put('/:id', clerkAuth, requireRole('admin'), updateActivity);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteActivity);

export default router;
