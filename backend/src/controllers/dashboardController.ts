import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { UserService } from '../services/userService';
import { SkillService } from '../services/skillService';
import { AuthRequest, ApiResponse } from '../types';
import { createError } from '../middleware/errorHandler';
import Notification from '../models/Notification';
import Skill from '../models/Skill';

const projectService = new ProjectService();
const userService = new UserService();
const skillService = new SkillService();

export class DashboardController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;

      const projectStats = await projectService.getProjectStats();

      let userStats: Record<string, number> = {};
      if (userId) {
        const [userProjects, userSkills, unreadCount] = await Promise.all([
          projectService.getUserProjects(userId),
          skillService.getUserSkills(userId),
          Notification.countDocuments({ userId, isRead: false })
        ]);

        userStats = {
          userProjectsCount: userProjects.length,
          userCompletedProjects: userProjects.filter(p => p.status === 'completed').length,
          userInProgressProjects: userProjects.filter(p => p.status === 'active').length,
          userSkillsCount: userSkills.length,
          userUnreadNotifications: unreadCount
        };
      }

      const totalSkills = await Skill.countDocuments({}).catch(() => 0);

      const stats: any = {
        projectsCompleted: projectStats.completed || 0,
        projectsInProgress: projectStats.active || 0,
        totalProjects: projectStats.total || 0,
        totalTeams: projectStats.total || 0,
        skillsLearned: userId ? userStats.userSkillsCount ?? 0 : (totalSkills ?? 0),
        projectCompletionRate: projectStats.total > 0
          ? Math.round((projectStats.completed / projectStats.total) * 100)
          : 0,
        ...userStats
      };

      const response: ApiResponse = {
        ok: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('Authentication required', 401);
      }

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);

      const activities = notifications.map(n => ({
        id: (n as any)._id,
        type: n.type,
        title: n.title,
        project: n.metadata?.projectName || n.category,
        timestamp: n.createdAt,
        user: {
          name: n.sender?.name || 'System',
          avatar: n.sender?.avatar || undefined
        }
      }));

      const response: ApiResponse = {
        ok: true,
        data: activities,
        message: 'Recent activities retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('Authentication required', 401);
      }

      // Derive upcoming items from project deadlines the user is part of
      const projects = await projectService.getUserProjects(userId);
      const now = new Date();

      const tasks = projects
        .filter(p => p.deadline && new Date(p.deadline) > now)
        .map(p => ({
          id: (p as any)._id,
          title: `${p.name} deadline`,
          project: p.name,
          dueDate: p.deadline,
          priority: p.status === 'active' ? 'high' : 'medium',
          status: p.status
        }))
        .sort((a, b) => +new Date(a.dueDate as any) - +new Date(b.dueDate as any))
        .slice(0, 20);

      const response: ApiResponse = {
        ok: true,
        data: tasks,
        message: 'Upcoming items retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSkillProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        throw createError('Authentication required', 401);
      }

      const skills = await skillService.getUserSkills(userId);

      const response: ApiResponse = {
        ok: true,
        data: skills,
        message: 'Skill progress retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
