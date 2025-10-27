import { useAuth } from '../AuthContext';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 1000; // Start with 1s timeout
  }

  connect(token) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    // Use secure WebSocket in production
    const wsUrl = process.env.NODE_ENV === 'production'
      ? `wss://${window.location.host}/ws`
      : `ws://localhost:3000/ws`;

    this.ws = new WebSocket(wsUrl);
    
    // Add auth token to connection
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({ type: 'auth', token }));
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.handleDisconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.ws?.close();
    };
  }

  handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout *= 2; // Exponential backoff
      setTimeout(() => this.connect(), this.reconnectTimeout);
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'message':
        this.notifySubscribers('message', data);
        break;
      case 'typing':
        this.notifySubscribers('typing', data);
        break;
      case 'status':
        this.notifySubscribers('status', data);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(event);
        }
      }
    };
  }

  notifySubscribers(event, data) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  sendMessage(recipientId, content) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'message',
      recipientId,
      content
    }));
  }

  sendTyping(recipientId, isTyping) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      type: 'typing',
      recipientId,
      isTyping
    }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;

// Custom hook for using WebSocket in components
export function useWebSocket() {
  const { user } = useAuth();

  const connect = () => {
    if (user?.token) {
      websocketService.connect(user.token);
    }
  };

  return {
    connect,
    sendMessage: websocketService.sendMessage.bind(websocketService),
    sendTyping: websocketService.sendTyping.bind(websocketService),
    subscribe: websocketService.subscribe.bind(websocketService),
    disconnect: websocketService.disconnect.bind(websocketService),
  };
}