import Project from '../models/Project';
import { CreateProjectRequest, UpdateProjectRequest, IProject, ProjectQuery } from '../types';
import { createError } from '../middleware/errorHandler';
import { codeSandboxService } from './codeSandboxService';

export class ProjectService {
  async createProject(userId: string, projectData: CreateProjectRequest): Promise<IProject> {
    try {
      const project = new Project({
        ...projectData,
        createdBy: userId,
        department: projectData.department || 'General',
        deadline: projectData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        templateId: projectData.templateId || 'default',
        sandboxTemplate: projectData.sandboxTemplate || 'default',
        status: 'recruiting',
        technologies: projectData.technologies || [],
        isPublic: true,
        members: {
          current: 1,
          max: projectData.maxMembers || 5,
          userIds: [userId],
          avatars: []
        },
        tags: [],
        metrics: {
          commits: 0,
          issues: 0,
          stars: 0
        },
        progress: 0
      });
      
      await project.save();
      
      // Initialize IDE workspace
      await this.initializeIDEWorkspace(project);
      
      return project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  private async initializeIDEWorkspace(project: IProject): Promise<void> {
    try {
      // Create sandbox using new SDK
      const workspace = await codeSandboxService.createProjectSandbox(
        project.name,
        (project as any).sandboxTemplate || 'node',
        project._id?.toString()
      );

      if (!workspace) {
        console.warn('⚠️  Sandbox creation skipped - CodeSandbox API key not configured');
        return;
      }

      // Update project with workspace details
      await Project.findByIdAndUpdate(project._id, {
        workspace: {
          sandboxId: workspace.sandboxId,
          ideUrl: workspace.ideUrl,
          embedUrl: workspace.embedUrl,
          editUrl: workspace.editUrl
        }
      });

      console.log(`✅ Workspace initialized for project ${project._id}`);
    } catch (error) {
      console.error('❌ IDE workspace initialization error:', error);
      // Don't fail project creation if IDE setup fails
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
        .limit(limit)
        .lean(); // Convert to plain JavaScript objects

      
      const total = await Project.countDocuments(filter);

      // Map the lean results to proper format with all required fields
      const mappedProjects = projects.map(project => ({
        _id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        technologies: project.technologies || [],
        templateId: project.templateId,
        sandboxTemplate: project.sandboxTemplate,
        isPublic: project.isPublic ?? true,
        workspace: project.workspace || {},
        members: {
          current: project.members?.current || 0,
          max: project.members?.max || 5,
          userIds: project.members?.userIds || [],
          avatars: project.members?.avatars || []
        },
        progress: project.progress || 0,
        deadline: project.deadline,
        createdBy: project.createdBy,
        department: project.department,
        difficulty: project.difficulty,
        tags: project.tags || [],
        metrics: project.metrics || { commits: 0, issues: 0, stars: 0 },
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));

      return { projects: mappedProjects as any as IProject[], total };
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
      // Find the project first to get sandbox ID
      const project = await Project.findOne({ _id: projectId, createdBy: userId });
      
      if (!project) {
        return false;
      }

      // Delete the CodeSandbox if it exists
      if ((project as any).workspace?.sandboxId) {
        try {
          await codeSandboxService.deleteSandbox((project as any).workspace.sandboxId);
          console.log(`✅ Sandbox deleted for project ${projectId}`);
        } catch (sandboxError) {
          console.error('⚠️  Error deleting sandbox:', sandboxError);
          // Continue with project deletion even if sandbox deletion fails
        }
      }

      // Delete the project from database
      await Project.findByIdAndDelete(projectId);
      return true;
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
