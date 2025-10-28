import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ProjectChatService } from './projectChatService';

const projectChatService = new ProjectChatService();

interface SocketData {
  userName?: string;
  userAvatar?: string;
  [key: string]: any;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  data: SocketData;
}

export class WebSocketService {
  private io: Server;
  private userSockets: Map<string, string>; // userId -> socketId
  private projectRooms: Map<string, Set<string>>; // projectId -> Set of userIds

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.userSockets = new Map();
    this.projectRooms = new Map();
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
          // cache user details for project chat messages
          socket.data = socket.data || {};
          socket.data.userName = user.name;
          socket.data.userAvatar = user.picture;
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
      console.log(`✅ User connected: ${socket.userId}`);

      if (socket.userId) {
        this.userSockets.set(socket.userId, socket.id);
        console.log(`📋 Registered user socket: ${socket.userId} -> ${socket.id}`);
        console.log(`📋 Total connected users: ${this.userSockets.size}`);
        console.log(`📋 All connected user IDs:`, Array.from(this.userSockets.keys()));
      }

      // Join project rooms
      socket.on('join_project', (data: { projectId: string }) => {
        if (!socket.userId) return;
        
        const roomName = `project:${data.projectId}`;
        socket.join(roomName);
        
        if (!this.projectRooms.has(data.projectId)) {
          this.projectRooms.set(data.projectId, new Set());
        }
        this.projectRooms.get(data.projectId)?.add(socket.userId);
        
        console.log(`User ${socket.userId} joined project ${data.projectId}`);
        
        // Notify other members
        socket.to(roomName).emit('user_joined_project', {
          userId: socket.userId,
          projectId: data.projectId
        });
      });

      // Leave project rooms
      socket.on('leave_project', (data: { projectId: string }) => {
        if (!socket.userId) return;
        
        const roomName = `project:${data.projectId}`;
        socket.leave(roomName);
        
        this.projectRooms.get(data.projectId)?.delete(socket.userId);
        
        socket.to(roomName).emit('user_left_project', {
          userId: socket.userId,
          projectId: data.projectId
        });
      });

      // Send project chat message
      socket.on('send_project_message', async (data: { projectId: string, content: string }) => {
        try {
          if (!socket.userId) {
            throw new Error('User not authenticated');
          }

          const message = await projectChatService.addMessage(
            data.projectId,
            socket.userId,
            {
              message: data.content,
              userName: socket.data?.userName || 'Unknown User',
              userAvatar: socket.data?.userAvatar || '',
              type: 'text'
            }
          );

          // Transform to frontend format similar to getProjectMessages
          const transformed = {
            id: (message as any).id || (message as any)._id?.toString?.() || '',
            projectId: data.projectId, // Include projectId for handler lookup
            content: (message as any).message,
            timestamp: (message as any).timestamp || new Date(),
            sender: {
              id: (message as any).userId,
              name: (message as any).userName,
              avatar: (message as any).userAvatar
            },
            type: (message as any).type,
            codeBlock: (message as any).codeBlock
          };
          
          console.log('Broadcasting project message to room:', `project:${data.projectId}`, transformed);

          // Broadcast to all members in project room
          const roomName = `project:${data.projectId}`;
          this.io.to(roomName).emit('new_project_message', transformed);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send project message' });
        }
      });

      // Project typing indicator
      socket.on('project_typing', (data: { projectId: string, isTyping: boolean }) => {
        if (!socket.userId) return;
        
        const roomName = `project:${data.projectId}`;
        socket.to(roomName).emit('user_typing_project', {
          userId: socket.userId,
          projectId: data.projectId,
          isTyping: data.isTyping
        });
      });


      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
          
          // Clean up project rooms
          this.projectRooms.forEach((users, projectId) => {
            if (users.has(socket.userId!)) {
              users.delete(socket.userId!);
              socket.to(`project:${projectId}`).emit('user_left_project', {
                userId: socket.userId,
                projectId
              });
            }
          });
        }
      });
    });
  }

  // Send notification to a specific user
  public sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  // Send notification to all project members
  public sendNotificationToProject(projectId: string, notification: any) {
    const roomName = `project:${projectId}`;
    this.io.to(roomName).emit('project_notification', notification);
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is online
  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
