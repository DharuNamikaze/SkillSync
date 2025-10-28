import io from 'socket.io-client';

class WebSocketService {
  socket = null;
  projectMessageHandlers = new Map(); // Project chat messages
  projectTypingHandlers = new Map(); // Project chat typing
  notificationHandlers = new Set(); // Notification handlers
  connectionHandlers = new Set();
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  reconnectInterval = null;
  joinedProjects = new Set(); // Track joined projects

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onConnectionChange = this.onConnectionChange.bind(this);
  }

  onConnectionChange(connected) {
    this.connectionHandlers.forEach(handler => handler(connected));
    if (connected) {
      this.reconnectAttempts = 0;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    }
  }

  addConnectionHandler(handler) {
    this.connectionHandlers.add(handler);
    if (this.socket) {
      handler(this.socket.connected);
    }
    return () => this.connectionHandlers.delete(handler);
  }


  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Extract base URL (remove /api if present)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const wsUrl = apiUrl.replace('/api', '');

    this.socket = io(wsUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.onConnectionChange(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.onConnectionChange(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts && !this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
            return;
          }
          console.log('Attempting to reconnect...');
          this.connect(token);
        }, 10000);
      }
    });

    // Set up project chat handlers
    this.socket.on('new_project_message', (message) => {
      console.log('WebSocket received new_project_message:', message);
      const handler = this.projectMessageHandlers.get(message.projectId);
      console.log('Handler found for project:', message.projectId, ':', !!handler);
      if (handler) {
        handler(message);
      } else {
        console.warn('No handler registered for project:', message.projectId);
        console.log('Registered project handlers:', Array.from(this.projectMessageHandlers.keys()));
      }
    });

    this.socket.on('user_typing_project', ({ userId, projectId, isTyping }) => {
      const handler = this.projectTypingHandlers.get(projectId);
      if (handler) {
        handler(userId, isTyping);
      }
    });

    this.socket.on('user_joined_project', ({ userId, projectId }) => {
      console.log(`User ${userId} joined project ${projectId}`);
    });

    this.socket.on('user_left_project', ({ userId, projectId }) => {
      console.log(`User ${userId} left project ${projectId}`);
    });

    // Message notification listener
    this.socket.on('message_notification', (notification) => {
      console.log('Received message notification:', notification);
      this.notificationHandlers.forEach(handler => handler(notification));
    });

    // General notification listener (for in-app notifications)
    this.socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      this.notificationHandlers.forEach(handler => handler(notification));
    });
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    // Leave all project rooms
    this.joinedProjects.forEach(projectId => {
      this.leaveProject(projectId);
    });
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.projectMessageHandlers.clear();
    this.projectTypingHandlers.clear();
    this.notificationHandlers.clear();
    this.connectionHandlers.clear();
    this.joinedProjects.clear();
    this.reconnectAttempts = 0;
  }


  // Project chat methods
  joinProject(projectId) {
    if (!this.socket?.connected) {
      console.warn('Cannot join project - socket not connected');
      return;
    }
    this.socket.emit('join_project', { projectId });
    this.joinedProjects.add(projectId);
    console.log(`Joined project room: ${projectId}`);
  }

  leaveProject(projectId) {
    if (!this.socket?.connected) return;
    this.socket.emit('leave_project', { projectId });
    this.joinedProjects.delete(projectId);
    this.projectMessageHandlers.delete(projectId);
    this.projectTypingHandlers.delete(projectId);
    console.log(`Left project room: ${projectId}`);
  }

  async sendProjectMessage(projectId, content) {
    if (!this.socket?.connected) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send_project_message', { projectId, content }, (response) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  onProjectMessage(projectId, callback) {
    console.log('Registering project message handler for:', projectId);
    this.projectMessageHandlers.set(projectId, callback);
    return () => {
      console.log('Unregistering project message handler for:', projectId);
      this.projectMessageHandlers.delete(projectId);
    };
  }

  emitProjectTyping(projectId, isTyping) {
    if (!this.socket?.connected) return;
    this.socket.emit('project_typing', { projectId, isTyping });
  }

  onProjectTyping(projectId, callback) {
    this.projectTypingHandlers.set(projectId, callback);
    return () => this.projectTypingHandlers.delete(projectId);
  }

  // Notification handlers
  onNotification(callback) {
    this.notificationHandlers.add(callback);
    return () => this.notificationHandlers.delete(callback);
  }

  // Get connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();
