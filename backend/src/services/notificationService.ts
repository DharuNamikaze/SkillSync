import Notification from '../models/Notification';
import { CreateNotificationRequest, INotification, NotificationQuery } from '../types';
import { createError } from '../middleware/errorHandler';

export class NotificationService {
  async createNotification(notificationData: CreateNotificationRequest): Promise<INotification> {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, query: NotificationQuery): Promise<{ notifications: INotification[], total: number }> {
    try {
      const { filter = 'all', unreadOnly = false, page = 1, limit = 50 } = query;
      const filterQuery: any = { userId };
      
      if (filter !== 'all') {
        filterQuery.category = filter;
      }
      
      if (unreadOnly) {
        filterQuery.isRead = false;
      }

      const skip = (page - 1) * limit;
      const notifications = await Notification.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(filterQuery);

      return { notifications, total };
    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  }

  async getNotificationById(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOne({ _id: notificationId, userId });
      return notification;
    } catch (error) {
      console.error('Get notification by ID error:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      return result.modifiedCount;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const result = await Notification.findOneAndDelete({ _id: notificationId, userId });
      return !!result;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await Notification.countDocuments({ userId, isRead: false });
      return count;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  async createProjectInvitationNotification(
    userId: string,
    projectId: string,
    projectName: string,
    senderId: string,
    senderName: string,
    senderAvatar?: string
  ): Promise<INotification> {
    try {
      const notificationData: CreateNotificationRequest = {
        userId,
        type: 'invitation',
        title: 'Project Invitation',
        message: `${senderName} invited you to join ${projectName}`,
        priority: 'high',
        sender: {
          id: senderId,
          name: senderName,
          avatar: senderAvatar,
          role: 'Project Lead'
        },
        actionUrl: `/projects/${projectId}`,
        category: 'projects',
        metadata: {
          projectId,
          projectName
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Create project invitation notification error:', error);
      throw error;
    }
  }

  async createTaskAssignmentNotification(
    userId: string,
    taskId: string,
    taskName: string,
    projectName: string,
    senderId: string,
    senderName: string,
    dueDate?: string,
    estimatedHours?: number
  ): Promise<INotification> {
    try {
      const notificationData: CreateNotificationRequest = {
        userId,
        type: 'task_assignment',
        title: 'New Task Assigned',
        message: `You have been assigned ${taskName} in ${projectName}`,
        priority: 'medium',
        sender: {
          id: senderId,
          name: senderName,
          role: 'Project Manager'
        },
        actionUrl: `/tasks/${taskId}`,
        category: 'tasks',
        metadata: {
          taskId,
          dueDate,
          estimatedHours
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Create task assignment notification error:', error);
      throw error;
    }
  }

  async createDeadlineNotification(
    userId: string,
    projectId: string,
    projectName: string,
    daysLeft: number,
    completionPercentage: number
  ): Promise<INotification> {
    try {
      const notificationData: CreateNotificationRequest = {
        userId,
        type: 'deadline',
        title: 'Approaching Deadline',
        message: `${projectName} project deadline is in ${daysLeft} days`,
        priority: daysLeft <= 1 ? 'high' : 'medium',
        sender: {
          id: 'system',
          name: 'System',
          role: 'Automated'
        },
        actionUrl: `/projects/${projectId}`,
        category: 'deadlines',
        metadata: {
          projectId,
          daysLeft,
          completionPercentage
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Create deadline notification error:', error);
      throw error;
    }
  }
}
