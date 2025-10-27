import { Router } from 'express';
import { ProjectChatController } from '../controllers/projectChatController';
import { validateMessageContent } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';

const router = Router();
const chatController = new ProjectChatController();

// Project chat routes
router.post('/:projectId/chat', requireAuth, validateMessageContent, chatController.addMessage);
router.get('/:projectId/chat', requireAuth, chatController.getMessages);
router.delete('/:projectId/chat/:messageId', requireAuth, chatController.deleteMessage);

export default router;