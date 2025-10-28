# Message Notification Feature

## Overview
The SkillSync project now includes browser notifications for new messages. When you receive a message in a project chat while the browser tab is not active, you'll get a native browser notification.

## Features

### 1. Browser Notifications
- **Real-time alerts**: Get notified immediately when someone sends a message in a project chat
- **Smart notifications**: Notifications only appear when:
  - The message is from another user (not yourself)
  - The browser tab is not in focus (minimized or in background)
  - You have enabled notifications

### 2. Notification Toggle
- **Bell icon** in the chat header shows notification status
- **Blue bell**: Notifications are enabled
- **Gray bell**: Notifications are disabled
- Click the bell icon to request notification permission

### 3. Notification Content
Each notification displays:
- **Sender's name** and **project name** in the title
- **Message content** in the body
- **Project avatar/icon**

### 4. Notification Actions
- **Click notification**: Brings the browser window to focus
- **Auto-dismiss**: Notifications automatically close after 5 seconds

## How to Use

### Enable Notifications
1. Open the Messages page
2. Select a project from the sidebar
3. Click the bell icon in the chat header
4. Allow notifications when your browser prompts you

### Receiving Notifications
1. Once enabled, you'll receive notifications automatically
2. Notifications appear when you receive messages while the tab is inactive
3. Click on a notification to return to the chat

## Technical Implementation

### Frontend Components
- **`notificationUtils.js`**: Utility functions for browser notifications
  - `requestNotificationPermission()`: Request permission from user
  - `canShowNotification()`: Check if notifications are allowed
  - `showMessageNotification()`: Display message notification

- **`websocketService.js`**: WebSocket service with notification support
  - Listens for `message_notification` events
  - Manages notification handlers

- **`Messages.jsx`**: Main chat component
  - Notification toggle button
  - Automatic notification display for incoming messages
  - Checks if message is from another user and tab is hidden

### Backend Components
- **`websocketService.ts`**: Server-side WebSocket service
  - Emits `message_notification` events to project members
  - Excludes message sender from notifications
  - Tracks user sockets for targeted notifications

## Browser Compatibility
This feature works on all modern browsers that support:
- Notification API
- WebSockets
- ES6+

Tested on:
- Chrome/Edge (version 80+)
- Firefox (version 75+)
- Safari (version 13+)

## Privacy & Permissions
- Notifications require explicit user permission
- Users can revoke permission at any time through browser settings
- No notification data is stored on servers
- Notifications are ephemeral and disappear after being viewed

## Troubleshooting

### Notifications not appearing?
1. Check browser notification permissions
2. Ensure notifications are enabled (bell icon should be blue)
3. Verify the browser tab is not in focus
4. Check browser notification settings (not blocked for the site)

### How to reset permissions?
1. Open browser settings
2. Navigate to Site Settings > Notifications
3. Find your SkillSync site
4. Reset or change permission

## Future Enhancements
Potential improvements for this feature:
- Sound alerts option
- Custom notification sounds
- Notification preferences (mute specific projects)
- Do Not Disturb mode
- Desktop notification center integration
- Push notifications for mobile devices
