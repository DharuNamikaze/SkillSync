import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { createError } from '../middleware/errorHandler';

const userService = new UserService();

export class UserController {
  async createOrUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      
      if (!userData || typeof userData !== 'object') {
        throw createError('Valid user data is required', 400);
      }

      const user = await userService.createOrUpdateUser(userData);
      if (!user) {
        throw createError('Failed to create/update user', 500);
      }
      
      const response: ApiResponse = {
        ok: true,
        data: user,
        message: 'User created/updated successfully'
      };
      
      // Use 201 status code for creation
      res.status(201).json(response);
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

      // First check if user exists
      const existingUser = await userService.getUserById(userId);
      if (!existingUser) {
        throw createError('User not found', 404);
      }

      const updateData = req.body;
      const user = await userService.updateUserProfile(userId, updateData);
      
      if (!user) {
        throw createError('Failed to update user profile', 500);
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

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      const currentUserId = (req as AuthRequest).user?.id;
      
      if (!query || typeof query !== 'string') {
        throw createError('Valid search query is required', 400);
      }

      if (!currentUserId) {
        throw createError('Authentication required', 401);
      }

      const users = await userService.searchUsers(query, currentUserId);
      
      const response: ApiResponse = {
        ok: true,
        data: users,
        message: 'Users found successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
