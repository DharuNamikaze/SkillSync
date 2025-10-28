/**
 * Notification utilities for browser notifications
 */

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} - Returns true if permission granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Check if notifications are supported and permitted
 * @returns {boolean}
 */
export const canShowNotification = () => {
  return (
    'Notification' in window &&
    Notification.permission === 'granted'
  );
};

/**
 * Show a browser notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 * @returns {Notification|null}
 */
export const showNotification = (title, options = {}) => {
  console.log('🔔 showNotification called:', { title, options });
  
  if (!canShowNotification()) {
    console.warn('🔔 Notifications not permitted');
    return null;
  }

  const defaultOptions = {
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };

  console.log('🔔 Creating notification with options:', defaultOptions);

  try {
    const notification = new Notification(title, defaultOptions);
    console.log('🔔 Notification object created successfully');
    
    // Auto close after 5 seconds if not interacted
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('🔔 Error showing notification:', error);
    return null;
  }
};

/**
 * Show a message notification
 * @param {string} senderName - Name of the message sender
 * @param {string} messageContent - Content of the message
 * @param {string} projectName - Name of the project
 * @param {Function} onClick - Callback when notification is clicked
 */
export const showMessageNotification = (senderName, messageContent, projectName, onClick) => {
  console.log('🔔 showMessageNotification called:', { senderName, messageContent, projectName });
  console.log('🔔 Can show notification:', canShowNotification());
  console.log('🔔 Notification permission:', Notification.permission);
  
  if (!canShowNotification()) {
    console.warn('🔔 Cannot show notification - permission not granted');
    return null;
  }

  const notification = showNotification(
    `${senderName} • ${projectName}`,
    {
      body: messageContent,
      tag: `message-${projectName}`,
      icon: '/logo.png',
      data: { type: 'message', projectName, senderName }
    }
  );

  console.log('🔔 Notification created:', notification);

  if (notification && onClick) {
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      onClick();
      notification.close();
    };
  }

  return notification;
};
