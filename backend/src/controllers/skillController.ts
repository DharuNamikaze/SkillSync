import { Request, Response, NextFunction } from 'express';
import { SkillService } from '../services/skillService';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { createError } from '../middleware/errorHandler';

const skillService = new SkillService();

export class SkillController {
  async createSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const skillData = req.body;
      const skill = await skillService.createSkill(userId, skillData);
      
      const response: ApiResponse = {
        ok: true,
        data: skill,
        message: 'Skill created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const skills = await skillService.getUserSkills(userId);
      
      const response: ApiResponse = {
        ok: true,
        data: skills,
        message: 'Skills retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSkillById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const skill = await skillService.getSkillById(id, userId);
      
      if (!skill) {
        throw createError('Skill not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: skill,
        message: 'Skill retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const updateData = req.body;
      const skill = await skillService.updateSkill(id, userId, updateData);
      
      if (!skill) {
        throw createError('Skill not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: skill,
        message: 'Skill updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const deleted = await skillService.deleteSkill(id, userId);
      
      if (!deleted) {
        throw createError('Skill not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        message: 'Skill deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSkillsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { category } = req.params;
      const skills = await skillService.getSkillsByCategory(userId, category);
      
      const response: ApiResponse = {
        ok: true,
        data: skills,
        message: 'Skills by category retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async searchSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { q } = req.query;
      if (!q) {
        throw createError('Search query is required', 400);
      }

      const skills = await skillService.searchSkills(userId, q as string);
      
      const response: ApiResponse = {
        ok: true,
        data: skills,
        message: 'Skills search completed successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSkillCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const categories = await skillService.getSkillCategories(userId);
      
      const response: ApiResponse = {
        ok: true,
        data: categories,
        message: 'Skill categories retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
