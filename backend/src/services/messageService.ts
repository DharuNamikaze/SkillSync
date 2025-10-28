import Message from '../models/Message';
import { IMessage } from '../models/Message';
import { createError } from '../middleware/errorHandler';

export class MessageService {
  async getConversation(userId1: string, userId2: string, page: number = 1, limit: number = 20): Promise<{ messages: IMessage[], total: number }> {
    try {
      const skip = (page - 1) * limit;
      const messages = await Message.find({
        $or: [
          { sender: userId1, recipient: userId2 },
          { sender: userId2, recipient: userId1 }
        ]
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name username picture')
      .populate('recipient', 'name username picture');

      const total = await Message.countDocuments({
        $or: [
          { sender: userId1, recipient: userId2 },
          { sender: userId2, recipient: userId1 }
        ]
      });

      return { messages, total };
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  }

  async createMessage(senderId: string, recipientId: string, content: string): Promise<IMessage> {
    try {
      if (!content.trim()) {
        throw createError('Message content cannot be empty', 400);
      }

      const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        content: content.trim()
      });

      return message.populate(['sender', 'recipient']);
    } catch (error) {
      console.error('Create message error:', error);
      throw error;
    }
  }

  async markMessagesAsRead(userId: string, conversationPartnerId: string): Promise<void> {
    try {
      await Message.updateMany(
        {
          recipient: userId,
          sender: conversationPartnerId,
          read: false
        },
        { read: true }
      );
    } catch (error) {
      console.error('Mark messages as read error:', error);
      throw error;
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      return await Message.countDocuments({
        recipient: userId,
        read: false
      });
    } catch (error) {
      console.error('Get unread message count error:', error);
      throw error;
    }
  }

  async getRecentConversations(userId: string): Promise<any[]> {
    try {
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { recipient: userId }]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$recipient",
                "$sender"
              ]
            },
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$recipient", userId] },
                      { $eq: ["$read", false] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            id: { $toString: '$_id' },
            user: {
              id: { $toString: '$user._id' },
              name: '$user.name',
              username: '$user.username',
              picture: '$user.picture',
              avatar: '$user.picture', // Frontend expects avatar
              status: 'offline', // Default status
              lastSeen: null
            },
            lastMessage: {
              id: { $toString: '$lastMessage._id' },
              content: '$lastMessage.content',
              timestamp: '$lastMessage.createdAt',
              status: { 
                $cond: [
                  { $eq: ['$lastMessage.read', true] },
                  'read',
                  'delivered'
                ]
              }
            },
            unreadCount: '$unreadCount'
          }
        },
        {
          $sort: { 'lastMessage.timestamp': -1 }
        }
      ]);

      return conversations;
    } catch (error) {
      console.error('Get recent conversations error:', error);
      throw error;
    }
  }
}