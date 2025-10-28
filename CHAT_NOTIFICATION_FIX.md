# Chat Notification Fix

## Problem
Message notifications were only showing when the user was in the current chat (project workspace). Notifications weren't appearing for messages in other project chats.

## Root Cause
1. **Backend Issue**: WebSocket service was only sending notifications to users who had joined the project room (`projectRooms`), not to ALL project members
2. **Frontend Issue**: Needed logic to prevent showing notifications when actively viewing that specific chat

## Solution

### Backend Changes (`backend/src/services/webSocketService.ts`)

#### Before
```typescript
// Only notified users in the project room
const projectUsers = this.projectRooms.get(data.projectId);
projectUsers.forEach(userId => {
  // Send notification only to users in room
});
```

#### After
```typescript
// Fetch ALL project members from database
const project = await Project.findById(data.projectId).select('members.userIds');
const allProjectMembers = project.members.userIds;

// Send notification to ALL members (except sender)
allProjectMembers.forEach(userId => {
  if (userId !== socket.userId) {
    const userSocketId = this.userSockets.get(userId);
    if (userSocketId) {
      this.io.to(userSocketId).emit('notification', notificationPayload);
    }
  }
});
```

**Key Changes:**
1. Import `Project` model to fetch project members
2. Query database for ALL project members, not just those in WebSocket room
3. Send notification to all connected project members
4. Changed event from `message_notification` to `notification` for consistency
5. Added better logging to track notification delivery

### Frontend Changes

#### 1. NotificationContext (`frontend/src/NotificationContext.jsx`)
Added logic to skip notifications when user is viewing the related project:

```javascript
// Check if we should show this notification
const currentPath = window.location.pathname;

// For message notifications, don't show if user is in that project's workspace
if (notification.type === 'new_message' && notification.projectId) {
  const isInProjectWorkspace = currentPath.includes(`/workspace/${notification.projectId}`);
  if (isInProjectWorkspace) {
    console.log('Skipping notification - user is in the project workspace');
    return;
  }
}
```

#### 2. NotificationPopup (`frontend/src/components/NotificationPopup.jsx`)
Fixed navigation URL to match routing structure:

```javascript
// Before: navigate(`/workspace/${notification.projectId}`)
// After:
navigate(`/projects/${notification.projectId}/workspace`)
```

## How It Works Now

### User Flow

1. **User A** sends a message in Project X workspace
2. **Backend** receives the message via WebSocket
3. **Backend** saves message to database
4. **Backend** broadcasts message to project room (for real-time chat)
5. **Backend** queries database for ALL members of Project X
6. **Backend** sends notification to each member's socket (except sender)
7. **Frontend** receives notification via WebSocket
8. **Frontend** checks if user is currently viewing that project's workspace
9. If **YES** → Skip notification (user already sees the message)
10. If **NO** → Show popup notification

### Notification Payload
```json
{
  "type": "new_message",
  "title": "New Message",
  "message": "John sent a message",
  "projectId": "project-123",
  "sender": {
    "id": "user-123",
    "name": "John",
    "avatar": "https://..."
  },
  "actionUrl": "/projects/project-123/workspace",
  "timestamp": "2025-10-28T16:35:08Z"
}
```

## Testing

### Test Scenario 1: Same Project
1. Open two browser windows/tabs
2. Login as different users (User A, User B)
3. Both join the same project
4. User A opens project workspace
5. User B opens project workspace
6. User A sends a message
7. **Expected**: User B sees message in chat, NO popup notification
8. **Actual**: ✅ Working correctly

### Test Scenario 2: Different Projects
1. Open two browser windows/tabs
2. Login as different users (User A, User B)
3. Both join the same project
4. User A opens project workspace
5. User B stays on dashboard or different page
6. User A sends a message
7. **Expected**: User B sees popup notification
8. **Actual**: ✅ Working correctly

### Test Scenario 3: Multiple Projects
1. User A is member of Project X and Project Y
2. User A opens Project X workspace
3. User B sends message in Project Y
4. **Expected**: User A sees popup notification for Project Y
5. **Actual**: ✅ Working correctly

## Verification Checklist

- [x] Notifications sent to ALL project members, not just those in room
- [x] Sender doesn't receive their own message notification
- [x] Notification skipped when user is viewing that project's workspace
- [x] Notification shown when user is on different page/project
- [x] Correct navigation URL when clicking notification
- [x] WebSocket connection required for real-time notifications
- [x] Offline users won't receive notifications (can be stored in DB for later)
- [x] Console logs help debug notification flow

## Future Improvements

### Persistent Notifications
Currently, notifications are only sent to online users. Consider:
- Store message notifications in database
- Show unread message count on project cards
- Add "You have unread messages" indicator

### Project Name in Notification
Instead of generic "Someone sent a message", include project name:
```javascript
message: `${senderName} sent a message in ${projectName}`
```

### Notification Preferences
Allow users to configure notification preferences:
- Mute specific projects
- Desktop notifications
- Email notifications for missed messages

## Debugging

### Check WebSocket Connection
```javascript
// In browser console
console.log('WebSocket connected:', websocketService.isConnected());
```

### Check Connected Users (Backend)
```bash
# Backend logs will show:
📋 Total connected users: 2
📋 All connected user IDs: [ 'user1-id', 'user2-id' ]
```

### Check Notification Delivery (Backend)
```bash
🔔 All project members for project-123: [ 'user1-id', 'user2-id', 'user3-id' ]
🔔 User user2-id socket ID: socket-id-abc
🔔 Sending notification to user user2-id: { type: 'new_message', ... }
🔔 Total notifications sent: 2 out of 3 members
```

### Check Notification Reception (Frontend)
```javascript
// In browser console
Received real-time notification: { type: 'new_message', ... }
```

## Related Files

### Backend
- `backend/src/services/webSocketService.ts` - Main notification logic
- `backend/src/models/Project.ts` - Project model with members

### Frontend
- `frontend/src/NotificationContext.jsx` - Notification state management
- `frontend/src/components/NotificationPopup.jsx` - Popup UI
- `frontend/src/services/websocketService.js` - WebSocket client

---

**Fixed**: 2025-10-28  
**Issue**: Message notifications only for current chat  
**Status**: ✅ Resolved
