import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { AuthRequest, ApiResponse, PaginatedResponse, NotificationQuery } from '../types';
import { createError } from '../middleware/errorHandler';

const notificationService = new NotificationService();

export class NotificationController {
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const query: NotificationQuery = {
        filter: req.query.filter as string || 'all',
        unreadOnly: req.query.unreadOnly === 'true',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50
      };

      const { notifications, total } = await notificationService.getUserNotifications(userId, query);
      
      const response: PaginatedResponse<typeof notifications[0]> = {
        ok: true,
        data: notifications,
        pagination: {
          page: query.page!,
          limit: query.limit!,
          total,
          pages: Math.ceil(total / query.limit!)
        },
        message: 'Notifications retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const notification = await notificationService.getNotificationById(id, userId);
      
      if (!notification) {
        throw createError('Notification not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: notification,
        message: 'Notification retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const notification = await notificationService.markAsRead(id, userId);
      
      if (!notification) {
        throw createError('Notification not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: notification,
        message: 'Notification marked as read'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const count = await notificationService.markAllAsRead(userId);
      
      const response: ApiResponse = {
        ok: true,
        data: { count },
        message: `${count} notifications marked as read`
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const deleted = await notificationService.deleteNotification(id, userId);
      
      if (!deleted) {
        throw createError('Notification not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        message: 'Notification deleted successfully'
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

      const count = await notificationService.getUnreadCount(userId);
      
      const response: ApiResponse = {
        ok: true,
        data: { count },
        message: 'Unread count retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
