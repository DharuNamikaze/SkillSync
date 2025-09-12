import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
import { 
  validateNotificationId,
  validateNotificationQuery 
} from '../middleware/validation';

const router = Router();
const notificationController = new NotificationController();

// All notification routes require authentication
router.use(authenticateToken);

// Notification operations
router.get('/', validateNotificationQuery, notificationController.getUserNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.get('/:id', validateNotificationId, notificationController.getNotificationById);
router.put('/:id/read', validateNotificationId, notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', validateNotificationId, notificationController.deleteNotification);

export default router;
