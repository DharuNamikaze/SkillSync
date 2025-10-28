import express from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { validatePartnerId } from '../middleware/validation';
import { validateMessage } from '../middleware/validateMessage';
import { validateProjectId } from '../middleware/validateProjectId';

const router = express.Router();
const messageController = new MessageController();

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all recent conversations
 * @access  Private
 */
router.get('/conversations', 
  authenticateToken,
  messageController.getRecentConversations
);

/**
 * @route   GET /api/messages/conversations/unread
 * @desc    Get total unread message count
 * @access  Private
 */
router.get('/conversations/unread',
  authenticateToken,
  messageController.getUnreadCount
);

/**
 * @route   GET /api/messages/conversations/:partnerId/messages
 * @desc    Get conversation history with a specific user
 * @access  Private
 */
router.get('/conversations/:partnerId/messages',
  authenticateToken,
  validatePartnerId,
  messageController.getConversation
);

/**
 * @route   POST /api/messages/conversations/:partnerId/messages
 * @desc    Send a new message to a specific user
 * @access  Private
 */
router.post('/conversations/:partnerId/messages',
  authenticateToken,
  validatePartnerId,
  validateMessage,
  messageController.sendMessage
);

/**
 * @route   GET /api/messages/team/:projectId
 * @desc    Get team chat messages for a project
 * @access  Private
 */
router.get('/team/:projectId',
  authenticateToken,
  validateProjectId,
  messageController.getTeamChat
);

/**
 * @route   POST /api/messages/team/:projectId
 * @desc    Send a message to team chat
 * @access  Private
 */
router.post('/team/:projectId',
  authenticateToken,
  validateProjectId,
  validateMessage,
  messageController.sendTeamMessage
);

export default router;