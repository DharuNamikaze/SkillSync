import ProjectChat, { IProjectChat } from '../models/ProjectChat';
import Project from '../models/Project';
import { createError } from '../middleware/errorHandler';

export class ProjectChatService {
  async addMessage(projectId: string, userId: string, messageData: {
    message: string;
    userName: string;
    userAvatar: string;
    type?: 'text' | 'system' | 'code';
    codeBlock?: {
      language: string;
      content: string;
    };
  }): Promise<IProjectChat> {
    try {
      // Check if user is a member of the project
      const project = await Project.findById(projectId);
      if (!project) {
        throw createError('Project not found', 404);
      }

      if (!project.members.userIds.includes(userId)) {
        throw createError('Not authorized to chat in this project', 403);
      }

      const chatMessage = new ProjectChat({
        projectId,
        userId,
        message: messageData.message,
        userName: messageData.userName,
        userAvatar: messageData.userAvatar,
        type: messageData.type || 'text',
        codeBlock: messageData.codeBlock
      });

      await chatMessage.save();
      return chatMessage;
    } catch (error) {
      console.error('Add chat message error:', error);
      throw error;
    }
  }

  async getProjectMessages(projectId: string, userId: string, options: {
    limit?: number;
    before?: Date;
  } = {}): Promise<IProjectChat[]> {
    try {
      // Check if user is a member of the project
      const project = await Project.findById(projectId);
      if (!project) {
        throw createError('Project not found', 404);
      }

      if (!project.members.userIds.includes(userId)) {
        throw createError('Not authorized to view chat messages', 403);
      }

      const query: any = { projectId };
      if (options.before) {
        query.timestamp = { $lt: options.before };
      }

      const messages = await ProjectChat.find(query)
        .sort({ timestamp: -1 })
        .limit(options.limit || 50);

      return messages;
    } catch (error) {
      console.error('Get project messages error:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = await ProjectChat.findById(messageId);
      if (!message) {
        throw createError('Message not found', 404);
      }

      // Only allow message owner or project creator to delete
      const project = await Project.findById(message.projectId);
      if (!project) {
        throw createError('Project not found', 404);
      }

      if (message.userId !== userId && project.createdBy !== userId) {
        throw createError('Not authorized to delete this message', 403);
      }

      await ProjectChat.findByIdAndDelete(messageId);
      return true;
    } catch (error) {
      console.error('Delete chat message error:', error);
      throw error;
    }
  }
}