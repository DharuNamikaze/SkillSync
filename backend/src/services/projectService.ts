import Project from '../models/Project';
import { CreateProjectRequest, UpdateProjectRequest, IProject, ProjectQuery } from '../types';
import { createError } from '../middleware/errorHandler';

export class ProjectService {
  async createProject(userId: string, projectData: CreateProjectRequest): Promise<IProject> {
    try {
      const project = new Project({
        ...projectData,
        createdBy: userId,
        members: {
          current: 1,
          max: projectData.maxMembers,
          userIds: [userId]
        }
      });
      
      await project.save();
      return project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getProjects(query: ProjectQuery): Promise<{ projects: IProject[], total: number }> {
    try {
      const { search, status, difficulty, page = 1, limit = 10 } = query;
      const filter: any = {};

      // Search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { technologies: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Status filter
      if (status && status !== 'all') {
        filter.status = status;
      }

      // Difficulty filter
      if (difficulty) {
        filter.difficulty = difficulty;
      }

      const skip = (page - 1) * limit;
      const projects = await Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Project.countDocuments(filter);

      return { projects, total };
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  async getProjectById(projectId: string): Promise<IProject | null> {
    try {
      const project = await Project.findById(projectId);
      return project;
    } catch (error) {
      console.error('Get project by ID error:', error);
      throw error;
    }
  }

  async getUserProjects(userId: string): Promise<IProject[]> {
    try {
      const projects = await Project.find({
        $or: [
          { createdBy: userId },
          { 'members.userIds': userId }
        ]
      }).sort({ createdAt: -1 });
      
      return projects;
    } catch (error) {
      console.error('Get user projects error:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, userId: string, updateData: UpdateProjectRequest): Promise<IProject | null> {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, createdBy: userId },
        updateData,
        { new: true }
      );
      return project;
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    try {
      const result = await Project.findOneAndDelete({ _id: projectId, createdBy: userId });
      return !!result;
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  async joinProject(projectId: string, userId: string): Promise<IProject | null> {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw createError('Project not found', 404);
      }

      if (project.members.userIds.includes(userId)) {
        throw createError('Already a member of this project', 400);
      }

      if (project.members.current >= project.members.max) {
        throw createError('Project is full', 400);
      }

      project.members.userIds.push(userId);
      project.members.current += 1;
      
      await project.save();
      return project;
    } catch (error) {
      console.error('Join project error:', error);
      throw error;
    }
  }

  async leaveProject(projectId: string, userId: string): Promise<IProject | null> {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        throw createError('Project not found', 404);
      }

      if (!project.members.userIds.includes(userId)) {
        throw createError('Not a member of this project', 400);
      }

      project.members.userIds = project.members.userIds.filter(id => id !== userId);
      project.members.current -= 1;
      
      await project.save();
      return project;
    } catch (error) {
      console.error('Leave project error:', error);
      throw error;
    }
  }

  async getProjectStats(): Promise<{
    total: number;
    active: number;
    recruiting: number;
    completed: number;
    planning: number;
  }> {
    try {
      const stats = await Project.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        total: 0,
        active: 0,
        recruiting: 0,
        completed: 0,
        planning: 0
      };

      stats.forEach(stat => {
        result.total += stat.count;
        result[stat._id as keyof typeof result] = stat.count;
      });

      return result;
    } catch (error) {
      console.error('Get project stats error:', error);
      throw error;
    }
  }
}
