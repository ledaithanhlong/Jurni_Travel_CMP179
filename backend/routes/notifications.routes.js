import { Router } from 'express';
import { getUnreadCount, listNotifications, markAsRead, sendNotification } from '../controllers/notifications.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, listNotifications);
router.get('/unread-count', requireAuth, getUnreadCount);
router.post('/send', requireRole('admin'), sendNotification);
router.patch('/:id/read', requireAuth, markAsRead);

export default router;


