import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { MessageService } from './messageService';

const messageService = new MessageService();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class WebSocketService {
  private io: Server;
  private userSockets: Map<string, string>;

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    this.userSockets = new Map();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication token not provided');
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'skillsync-secret-key-2025';
        
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const user = await User.findById(decoded.id).select('-__v').lean();
          
          if (!user) {
            throw new Error('User not found');
          }

          socket.userId = decoded.id;
          next();
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
          }
          throw new Error('Invalid token');
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Authentication failed');
        next(err);
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId}`);

      if (socket.userId) {
        this.userSockets.set(socket.userId, socket.id);
      }

      // Handle new messages
      socket.on('send_message', async (data: { recipientId: string, content: string }) => {
        try {
          if (!socket.userId) {
            throw new Error('User not authenticated');
          }

          const message = await messageService.createMessage(
            socket.userId,
            data.recipientId,
            data.content
          );

          // Send to recipient if online
          const recipientSocketId = this.userSockets.get(data.recipientId);
          if (recipientSocketId) {
            this.io.to(recipientSocketId).emit('new_message', message);
          }

          // Send back to sender for confirmation
          socket.emit('message_sent', message);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing status
      socket.on('typing', (data: { recipientId: string, isTyping: boolean }) => {
        const recipientSocketId = this.userSockets.get(data.recipientId);
        if (recipientSocketId && socket.userId) {
          this.io.to(recipientSocketId).emit('user_typing', {
            userId: socket.userId,
            isTyping: data.isTyping
          });
        }
      });

      // Handle read receipts
      socket.on('mark_read', async (data: { conversationPartnerId: string }) => {
        try {
          if (!socket.userId) {
            throw new Error('User not authenticated');
          }

          await messageService.markMessagesAsRead(socket.userId, data.conversationPartnerId);

          // Notify the sender that their messages were read
          const partnerSocketId = this.userSockets.get(data.conversationPartnerId);
          if (partnerSocketId) {
            this.io.to(partnerSocketId).emit('messages_read', { userId: socket.userId });
          }
        } catch (error) {
          socket.emit('error', { message: 'Failed to mark messages as read' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
      });
    });
  }

  // Method to send notification to a specific user
  public sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }
}