import { Router } from 'express';
import { getUnreadCount, listNotifications, markAsRead, sendNotification } from '../controllers/notifications.controller.js';
import { clerkAuth, requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', clerkAuth, requireAuth, listNotifications);
router.get('/unread-count', clerkAuth, requireAuth, getUnreadCount);
router.post('/send', clerkAuth, requireRole('admin'), sendNotification);
router.patch('/:id/read', clerkAuth, requireAuth, markAsRead);

export default router;


