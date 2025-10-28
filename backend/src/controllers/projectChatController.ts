import { Request, Response, NextFunction } from 'express';
import { ProjectChatService } from '../services/projectChatService';
import { AuthRequest, ApiResponse } from '../types';

const chatService = new ProjectChatService();

export class ProjectChatController {
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Add message request:', {
        body: req.body,
        params: req.params,
        user: (req as AuthRequest).user
      });

      const userId = (req as AuthRequest).user?.id;
      const projectId = req.params.id || req.params.projectId; // Support both param names
      
      console.log('Parameters received:', {
        userId,
        projectId,
        params: req.params,
        body: req.body
      });
      
      if (!userId) {
        console.log('Message rejected: No user ID in token');
        return res.status(401).json({
          ok: false,
          error: 'Not authenticated'
        });
      }

      if (!projectId) {
        console.log('Message rejected: No project ID in params');
        return res.status(400).json({
          ok: false,
          error: 'Project ID is required'
        });
      }

      // Add the user's picture from auth context if not provided in body
      const messageData: {
        message: string;
        userName: string;
        userAvatar: string;
        type?: 'text' | 'system' | 'code';
        codeBlock?: {
          language: string;
          content: string;
        };
      } = {
        message: req.body.message,
        userName: req.body.userName || (req as AuthRequest).user?.name,
        userAvatar: req.body.userAvatar || (req as AuthRequest).user?.picture || '',
        type: req.body.type || 'text',
      };

      if (req.body.codeBlock) {
        messageData.codeBlock = req.body.codeBlock;
      }

      console.log('Attempting to add message:', {
        projectId,
        userId,
        messageData
      });

      const message = await chatService.addMessage(projectId, userId, messageData);

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

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Get messages request:', {
        params: req.params,
        query: req.query,
        user: (req as AuthRequest).user
      });

      const userId = (req as AuthRequest).user?.id;
      const projectId = req.params.id || req.params.projectId; // Support both param names
      const { before, limit } = req.query;
      
      if (!userId) {
        return res.status(401).json({
          ok: false,
          error: 'Not authenticated'
        });
      }

      console.log('Fetching messages for:', {
        projectId,
        userId,
        before,
        limit
      });

      const messages = await chatService.getProjectMessages(projectId, userId, {
        before: before ? new Date(before as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });

      const response: ApiResponse = {
        ok: true,
        data: messages,
        message: 'Messages retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { messageId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          ok: false,
          error: 'Not authenticated'
        });
      }

      await chatService.deleteMessage(messageId, userId);

      const response: ApiResponse = {
        ok: true,
        message: 'Message deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}