import io from 'socket.io-client';

class WebSocketService {
  socket = null;
  messageHandlers = new Map();
  typingHandlers = new Map();
  readReceiptHandlers = new Map();
  connectionHandlers = new Set();
  messageQueue = new Map();
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  reconnectInterval = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.emitTyping = this.emitTyping.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.markMessagesAsRead = this.markMessagesAsRead.bind(this);
    this.onMessagesRead = this.onMessagesRead.bind(this);
    this.onConnectionChange = this.onConnectionChange.bind(this);
    this.processMessageQueue = this.processMessageQueue.bind(this);
  }

  onConnectionChange(connected) {
    this.connectionHandlers.forEach(handler => handler(connected));
    if (connected) {
      this.reconnectAttempts = 0;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
      this.processMessageQueue();
    }
  }

  addConnectionHandler(handler) {
    this.connectionHandlers.add(handler);
    if (this.socket) {
      handler(this.socket.connected);
    }
    return () => this.connectionHandlers.delete(handler);
  }

  async processMessageQueue() {
    if (!this.socket?.connected) return;

    for (const [key, { recipientId, content, resolve, reject }] of this.messageQueue.entries()) {
      try {
        await this.sendMessage(recipientId, content);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        this.messageQueue.delete(key);
      }
    }
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
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

    // Set up message handlers
    this.socket.on('new_message', (message) => {
      const handler = this.messageHandlers.get(message.sender);
      if (handler) {
        handler(message);
      }
    });

    this.socket.on('message_sent', (message) => {
      const handler = this.messageHandlers.get(message.recipient);
      if (handler) {
        handler(message);
      }
    });

    // Set up typing handlers
    this.socket.on('user_typing', ({ userId, isTyping }) => {
      const handler = this.typingHandlers.get(userId);
      if (handler) {
        handler(isTyping);
      }
    });

    // Set up read receipt handlers
    this.socket.on('messages_read', ({ userId }) => {
      const handler = this.readReceiptHandlers.get(userId);
      if (handler) {
        handler();
      }
    });
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.messageHandlers.clear();
    this.typingHandlers.clear();
    this.readReceiptHandlers.clear();
    this.connectionHandlers.clear();
    this.messageQueue.clear();
    this.reconnectAttempts = 0;
  }

  async sendMessage(recipientId, content) {
    if (!this.socket?.connected) {
      return new Promise((resolve, reject) => {
        const messageId = Date.now().toString();
        this.messageQueue.set(messageId, {
          recipientId,
          content,
          resolve,
          reject
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send_message', { recipientId, content }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  onMessage(userId, callback) {
    this.messageHandlers.set(userId, callback);
    return () => this.messageHandlers.delete(userId);
  }

  emitTyping(recipientId, isTyping) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.emit('typing', { recipientId, isTyping });
  }

  onTyping(userId, callback) {
    this.typingHandlers.set(userId, callback);
    return () => this.typingHandlers.delete(userId);
  }

  markMessagesAsRead(conversationPartnerId) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.emit('mark_read', { conversationPartnerId });
  }

  onMessagesRead(userId, callback) {
    this.readReceiptHandlers.set(userId, callback);
    return () => this.readReceiptHandlers.delete(userId);
  }
}

export default new WebSocketService();
