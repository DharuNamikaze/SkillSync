import { Request, Response, NextFunction } from 'express';
import { ProjectChatService } from '../services/projectChatService';
import { AuthRequest, ApiResponse } from '../types';

const chatService = new ProjectChatService();

export class ProjectChatController {
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      const { projectId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          ok: false,
          error: 'Not authenticated'
        });
      }

      const message = await chatService.addMessage(projectId, userId, {
        message: req.body.message,
        userName: req.body.userName,
        userAvatar: req.body.userAvatar,
        type: req.body.type,
        codeBlock: req.body.codeBlock
      });

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
      const userId = (req as AuthRequest).user?.id;
      const { projectId } = req.params;
      const { before, limit } = req.query;
      
      if (!userId) {
        return res.status(401).json({
          ok: false,
          error: 'Not authenticated'
        });
      }

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