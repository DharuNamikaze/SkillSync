import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken } from './auth';
import websocketService from './services/websocketService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotifications, setPopupNotifications] = useState([]);

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/notifications/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.data?.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    const handleNotification = (notification) => {
      console.log('Received real-time notification:', notification);
      
      // Check if we should show this notification
      // Don't show if user is currently viewing the related chat/project
      const currentPath = window.location.pathname;
      
      // For message notifications, don't show if user is in that project's workspace
      if (notification.type === 'new_message' && notification.projectId) {
        const isInProjectWorkspace = currentPath.includes(`/workspace/${notification.projectId}`);
        if (isInProjectWorkspace) {
          console.log('Skipping notification - user is in the project workspace');
          return;
        }
      }
      
      // Add to popup notifications (auto-dismiss after 5 seconds)
      const popupNotif = {
        ...notification,
        id: `popup-${Date.now()}-${Math.random()}`,
        timestamp: new Date()
      };
      
      setPopupNotifications(prev => [...prev, popupNotif]);
      setUnreadCount(prev => prev + 1);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setPopupNotifications(prev => prev.filter(n => n.id !== popupNotif.id));
      }, 5000);
    };

    // Subscribe to WebSocket notifications
    const unsubscribe = websocketService.onNotification(handleNotification);

    return () => {
      unsubscribe();
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = getAuthToken();
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const dismissPopup = (popupId) => {
    setPopupNotifications(prev => prev.filter(n => n.id !== popupId));
  };

  const value = {
    notifications,
    unreadCount,
    popupNotifications,
    markAsRead,
    dismissPopup,
    setUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
