import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/messageService';
import { TeamChatService } from '../services/teamChatService';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { createError } from '../middleware/errorHandler';

const messageService = new MessageService();
const teamChatService = new TeamChatService();

export class MessageController {
  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { partnerId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { messages, total } = await messageService.getConversation(userId, partnerId, page, limit);

      // Mark messages as read
      await messageService.markMessagesAsRead(userId, partnerId);

      const response: PaginatedResponse<typeof messages[0]> = {
        ok: true,
        data: messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        message: 'Conversation retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { recipientId, content } = req.body;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      if (!recipientId || !content) {
        throw createError('Recipient ID and content are required', 400);
      }

      const message = await messageService.createMessage(userId, recipientId, content);

      const response: ApiResponse = {
        ok: true,
        data: message,
        message: 'Message sent successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRecentConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const conversations = await messageService.getRecentConversations(userId);

      const response: ApiResponse = {
        ok: true,
        data: conversations,
        message: 'Recent conversations retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const count = await messageService.getUnreadMessageCount(userId);

      const response: ApiResponse = {
        ok: true,
        data: { count },
        message: 'Unread message count retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTeamChat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { projectId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { messages, total } = await teamChatService.getTeamChat(projectId, page, limit);

      // Mark team messages as read for this user
      await teamChatService.markMessagesAsRead(projectId, userId);

      const response: PaginatedResponse<typeof messages[0]> = {
        ok: true,
        data: messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        message: 'Team chat messages retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async sendTeamMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { projectId } = req.params;
      const { content } = req.body;

      if (!userId) {
        throw createError('User ID not found', 401);
      }

      if (!content) {
        throw createError('Message content is required', 400);
      }

      const message = await teamChatService.createMessage(userId, projectId, content);

      const response: ApiResponse = {
        ok: true,
        data: message,
        message: 'Team message sent successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

}