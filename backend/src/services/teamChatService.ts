import TeamChat, { ITeamMessage } from '../models/TeamChat';
import Project from '../models/Project';
import { Types } from 'mongoose';

export class TeamChatService {
  async getTeamChat(projectId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await TeamChat.countDocuments({ projectId });
    
    const messages = await TeamChat.find({ projectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar')
      .lean();

    return { messages, total };
  }

  async createMessage(userId: string, projectId: string, content: string): Promise<ITeamMessage> {
    const message = new TeamChat({
      sender: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      content,
      readBy: [new Types.ObjectId(userId)],
    });

    await message.save();
    return message.populate('sender', 'name avatar');
  }

  async getUserTeamChats(userId: string) {
    // Get all projects the user is a member of
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).select('_id name');

    // Get latest message from each project's team chat
    const teamChats = await Promise.all(
      projects.map(async (project) => {
        const latestMessage = await TeamChat.findOne({ projectId: project._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'name avatar')
          .lean();

        const unreadCount = await TeamChat.countDocuments({
          projectId: project._id,
          readBy: { $ne: userId }
        });

        return {
          id: `team-${project._id}`,
          type: 'team',
          project: {
            id: project._id,
            name: project.name
          },
          lastMessage: latestMessage,
          unreadCount
        };
      })
    );

    return teamChats;
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    // Get all projects the user is a member of
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).select('_id');

    const projectIds = projects.map(p => p._id);

    // Count unread messages across all team chats
    const count = await TeamChat.countDocuments({
      projectId: { $in: projectIds },
      readBy: { $ne: userId }
    });

    return count;
  }

  async markMessagesAsRead(userId: string, projectId: string): Promise<void> {
    await TeamChat.updateMany(
      {
        projectId,
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId }
      }
    );
  }
}