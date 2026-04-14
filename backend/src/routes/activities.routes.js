import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';
import {
  listActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  listActivityMedia,
  createActivityMedia,
  updateActivityMedia,
  deleteActivityMedia,
  reorderActivityMedia,
  setActivityMediaThumbnail
} from '../controllers/activities.controller.js';

const router = Router();
router.get('/', cacheMiddleware(300), listActivities);
router.get('/:activityId/media', cacheMiddleware(300), listActivityMedia);
router.post('/', clerkAuth, requireRole('admin'), createActivity);
router.put('/:id', clerkAuth, requireRole('admin'), updateActivity);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteActivity);
router.post('/:activityId/media', clerkAuth, requireRole('admin'), createActivityMedia);
router.put('/:activityId/media/reorder', clerkAuth, requireRole('admin'), reorderActivityMedia);
router.put('/:activityId/media/:mediaId', clerkAuth, requireRole('admin'), updateActivityMedia);
router.put('/:activityId/media/:mediaId/thumbnail', clerkAuth, requireRole('admin'), setActivityMediaThumbnail);
router.delete('/:activityId/media/:mediaId', clerkAuth, requireRole('admin'), deleteActivityMedia);
export default router;


