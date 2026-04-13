import { Router } from 'express';
import { clerkAuth, requireAuth, requireRole } from '../middlewares/auth.js';
import { sendNotification, listNotifications, markAsRead, getUnreadCount } from '../controllers/notifications.controller.js';

const router = Router();
router.get('/', clerkAuth, requireAuth, listNotifications);
router.get('/unread-count', clerkAuth, requireAuth, getUnreadCount);
router.post('/send', clerkAuth, requireRole('admin'), sendNotification);
router.patch('/:id/read', clerkAuth, requireAuth, markAsRead);
export default router;


