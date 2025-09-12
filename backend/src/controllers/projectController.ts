import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { AuthRequest, ApiResponse, PaginatedResponse, ProjectQuery } from '../types';
import { createError } from '../middleware/errorHandler';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const projectData = req.body;
      const project = await projectService.createProject(userId, projectData);
      
      const response: ApiResponse = {
        ok: true,
        data: project,
        message: 'Project created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const query: ProjectQuery = {
        search: req.query.search as string,
        status: req.query.status as string,
        difficulty: req.query.difficulty as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };

      const { projects, total } = await projectService.getProjects(query);
      
      const response: PaginatedResponse<typeof projects[0]> = {
        ok: true,
        data: projects,
        pagination: {
          page: query.page!,
          limit: query.limit!,
          total,
          pages: Math.ceil(total / query.limit!)
        },
        message: 'Projects retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      
      if (!project) {
        throw createError('Project not found', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: project,
        message: 'Project retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const projects = await projectService.getUserProjects(userId);
      
      const response: ApiResponse = {
        ok: true,
        data: projects,
        message: 'User projects retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const updateData = req.body;
      const project = await projectService.updateProject(id, userId, updateData);
      
      if (!project) {
        throw createError('Project not found or unauthorized', 404);
      }

      const response: ApiResponse = {
        ok: true,
        data: project,
        message: 'Project updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const deleted = await projectService.deleteProject(id, userId);
      
      if (!deleted) {
        throw createError('Project not found or unauthorized', 404);
      }

      const response: ApiResponse = {
        ok: true,
        message: 'Project deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async joinProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const project = await projectService.joinProject(id, userId);
      
      const response: ApiResponse = {
        ok: true,
        data: project,
        message: 'Successfully joined project'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async leaveProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('User ID not found', 401);
      }

      const { id } = req.params;
      const project = await projectService.leaveProject(id, userId);
      
      const response: ApiResponse = {
        ok: true,
        data: project,
        message: 'Successfully left project'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProjectStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await projectService.getProjectStats();
      
      const response: ApiResponse = {
        ok: true,
        data: stats,
        message: 'Project statistics retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
