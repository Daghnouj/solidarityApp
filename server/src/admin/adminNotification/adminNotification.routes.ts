import { Router } from 'express';
import { AdminNotificationController } from './adminNotification.controller';
import { protectAdmin } from '../../../middlewares/protectAdmin';

const router = Router();

router.get('/', protectAdmin, AdminNotificationController.getNotifications);
router.get('/unread-count', protectAdmin, AdminNotificationController.getUnreadCount);
router.patch('/:notificationId/read', protectAdmin, AdminNotificationController.markAsRead);
router.patch('/mark-all-read', protectAdmin, AdminNotificationController.markAllAsRead);
router.delete('/:notificationId', protectAdmin, AdminNotificationController.deleteNotification);

export { router as adminNotificationRoutes };
