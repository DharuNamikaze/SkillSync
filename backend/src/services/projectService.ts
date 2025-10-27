import Project from '../models/Project';
import { CreateProjectRequest, UpdateProjectRequest, IProject, ProjectQuery } from '../types';
import { createError } from '../middleware/errorHandler';
import { CodeSandboxService } from './codeSandboxService';

export class ProjectService {
  async createProject(userId: string, projectData: CreateProjectRequest): Promise<IProject> {
    try {
      const project = new Project({
        ...projectData,
        createdBy: userId,
        department: projectData.department || 'General',
        deadline: projectData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        members: {
          current: 1,
          max: projectData.maxMembers || 5,
          userIds: [userId]
        }
      });
      
      await project.save();
      
      // Initialize IDE workspace
      await this.initializeIDEWorkspace(project);

      // Return the updated project including workspace fields
      const updated = await Project.findById(project._id);
      return (updated as any) || project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  private async initializeIDEWorkspace(project: IProject): Promise<void> {
    try {
      const workspace = await this.createCodeSandboxWorkspace(project);
      if (!workspace) return;

      await Project.findByIdAndUpdate(project._id, {
        workspace: {
          sandboxId: (workspace as any).id,
          ideUrl: (workspace as any).url,
          embedUrl: (workspace as any).embed_url,
          editUrl: (workspace as any).editor_url
        }
      });
    } catch (error) {
      console.error('IDE workspace initialization error:', error);
      // Don't fail project creation if IDE setup fails
    }
  }

  private async createCodeSandboxWorkspace(project: IProject): Promise<any> {
    const codeSandboxService = new CodeSandboxService();
    
    return await codeSandboxService.createSandbox({
      templateId: (project as any).templateId,
      name: project.name,
      description: project.description,
      technologies: project.technologies
    });
  }

  async ensureWorkspace(projectId: string): Promise<IProject | null> {
    const project = await Project.findById(projectId);
    if (!project) return null;

    try {
      const csb = new CodeSandboxService();
      let sandboxId = project.workspace?.sandboxId;

      // If sandbox missing or invalid, create a new one
      if (!sandboxId) {
        const ws = await this.createCodeSandboxWorkspace(project as any);
        if (!ws) return project;
        sandboxId = ws.id;
        await Project.findByIdAndUpdate(projectId, {
          workspace: {
            sandboxId: (ws as any).id,
            ideUrl: (ws as any).url,
            embedUrl: (ws as any).embed_url,
            editUrl: (ws as any).editor_url
          }
        });
        return await Project.findById(projectId);
      }

      // Try to fetch; if fails, recreate
      try {
        await (csb as any).sdk?.sandboxes.get(sandboxId);
      } catch {
        const ws = await this.createCodeSandboxWorkspace(project as any);
        if (!ws) return project;
        await Project.findByIdAndUpdate(projectId, {
          workspace: {
            sandboxId: (ws as any).id,
            ideUrl: (ws as any).url,
            embedUrl: (ws as any).embed_url,
            editUrl: (ws as any).editor_url
          }
        });
        return await Project.findById(projectId);
      }

      // Ensure links are present and up-to-date
      if (!project.workspace?.embedUrl || !project.workspace?.ideUrl) {
        await Project.findByIdAndUpdate(projectId, {
          workspace: {
            sandboxId,
            ideUrl: `https://codesandbox.io/p/sandbox/${sandboxId}`,
            embedUrl: `https://codesandbox.io/p/sandbox/${sandboxId}?embed=1`,
            editUrl: `https://codesandbox.io/p/sandbox/${sandboxId}`
          }
        });
        return await Project.findById(projectId);
      }

      return project;
    } catch (e) {
      console.error('ensureWorkspace error:', e);
      return project;
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
      // Use findOneAndUpdate with optimistic locking to prevent race conditions
      const project = await Project.findOneAndUpdate(
        {
          _id: projectId,
          'members.current': { $lt: '$members.max' }, // Only update if there's space
          'members.userIds': { $ne: userId } // Only update if user is not already a member
        },
        {
          $addToSet: { 'members.userIds': userId }, // Add userId if not present
          $inc: { 'members.current': 1 } // Increment member count
        },
        {
          new: true, // Return updated document
          runValidators: true // Run mongoose validators
        }
      );

      if (!project) {
        // Get the project to determine the specific error
        const existingProject = await Project.findById(projectId);
        if (!existingProject) {
          throw createError('Project not found', 404);
        }
        if (existingProject.members.userIds.includes(userId)) {
          throw createError('Already a member of this project', 400);
        }
        if (existingProject.members.current >= existingProject.members.max) {
          throw createError('Project is full', 400);
        }
        throw createError('Failed to join project', 500);
      }

      return project;
    } catch (error: any) {
      console.error('Join project error:', error);
      if (error.name === 'ValidationError') {
        throw createError('Invalid project data', 400);
      }
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
