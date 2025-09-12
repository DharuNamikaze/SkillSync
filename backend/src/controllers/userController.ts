import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { createError } from '../middleware/errorHandler';

const userService = new UserService();

export class UserController {
  async createOrUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await userService.createOrUpdateUser(userData);
      
      const response: ApiResponse = {
        ok: true,
        data: user,
        message: 'User created/updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        throw createError('User not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: user,
        message: 'User profile retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const updateData = req.body;
      const user = await userService.updateUserProfile(userId, updateData);
      
      if (!user) {
        throw createError('User not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: user,
        message: 'User profile updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const deleted = await userService.deleteUser(userId);
      if (!deleted) {
        throw createError('User not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        message: 'User deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { users, total } = await userService.getAllUsers(page, limit);
      
      const response: PaginatedResponse<typeof users[0]> = {
        ok: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        message: 'Users retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
