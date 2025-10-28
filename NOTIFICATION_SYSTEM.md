# In-App Notification System

## Overview
The SkillSync notification system provides real-time, in-app notifications without external notification services. Notifications appear in two places:
1. **Notification Popup**: Real-time popups in the top-right corner
2. **Notifications Page**: Full list of all notifications at `/notifications`

## Features

### ✨ Real-Time Notifications
- Instant delivery via WebSocket connection
- Auto-dismissing popups (5 seconds)
- Notification badge on sidebar bell icon
- No page refresh required

### 📱 Notification Popup
- Appears in top-right corner
- Shows recent notifications
- Click to navigate to relevant page
- Manual dismiss or auto-dismiss after 5 seconds
- Smooth animations

### 📄 Notifications Page
- Full notification history
- Filter by category (All, Projects, Tasks, Comments, Team, System)
- Show unread only toggle
- Mark as read/Mark all as read
- Delete individual notifications
- Stats dashboard (Total, Unread, Read counts)
- Rich metadata display

## Architecture

### Frontend Components

#### 1. **NotificationContext** (`frontend/src/NotificationContext.jsx`)
- Global notification state management
- Fetches unread count
- Listens for WebSocket notifications
- Manages popup notifications

#### 2. **NotificationPopup** (`frontend/src/components/NotificationPopup.jsx`)
- Displays real-time notification popups
- Auto-dismiss after 5 seconds
- Click to navigate functionality
- Progress bar animation

#### 3. **Notifications Page** (`frontend/src/components/Notifications.jsx`)
- Full notification list with filtering
- Mark as read/delete actions
- Stats dashboard
- Rich notification cards

#### 4. **Layout Integration** (`frontend/src/components/Layout.jsx`)
- Global notification popup
- Shows across all pages

#### 5. **Sidebar Badge** (`frontend/src/components/Sidebar.jsx`)
- Shows unread count
- Updates in real-time

### Backend Services

#### 1. **NotificationService** (`backend/src/services/notificationService.ts`)
- Creates notifications in database
- Sends real-time notifications via WebSocket
- Helper methods for different notification types:
  - Project invitations
  - Task assignments
  - Deadline reminders
  - Custom notifications

#### 2. **WebSocketService** (`backend/src/services/webSocketService.ts`)
- Real-time communication
- User socket mapping
- Notification emission to specific users

#### 3. **NotificationController** (`backend/src/controllers/notificationController.ts`)
- REST API endpoints for notifications
- Pagination support
- Filtering and search

## Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `invitation` | UserPlus | Blue | Project invitations |
| `task_assignment` | FileText | Orange | Task assignments |
| `comment` | MessageCircle | Green | Comments on tasks/projects |
| `new_message` | MessageCircle | Green | Chat messages |
| `deadline` | AlertCircle | Red | Deadline reminders |
| `achievement` | Award | Purple | Milestones/achievements |
| `mention` | MessageCircle | Yellow | @mentions |
| `team_update` | UserPlus | Indigo | Team changes |
| `system` | Bell | Gray | System messages |

## API Endpoints

### Get User Notifications
```http
GET /api/notifications
Query Parameters:
  - filter: 'all' | 'projects' | 'tasks' | etc.
  - unreadOnly: boolean
  - page: number
  - limit: number
```

### Get Notification by ID
```http
GET /api/notifications/:id
```

### Mark as Read
```http
PUT /api/notifications/:id/read
```

### Mark All as Read
```http
PUT /api/notifications/mark-all-read
```

### Delete Notification
```http
DELETE /api/notifications/:id
```

### Get Unread Count
```http
GET /api/notifications/unread-count
```

### Test Notification (Development Only)
```http
POST /api/test/test-notification
```

## Usage Examples

### Creating a Notification (Backend)

```typescript
import { NotificationService } from './services/notificationService';

const notificationService = new NotificationService();

// Set WebSocket service (usually done in controller)
notificationService.setWebSocketService(wsService);

// Create a custom notification
await notificationService.createNotification({
  userId: 'user-id',
  type: 'system',
  title: 'Welcome!',
  message: 'Welcome to SkillSync',
  priority: 'medium',
  sender: {
    id: 'system',
    name: 'System',
    role: 'Automated'
  },
  actionUrl: '/dashboard',
  category: 'system'
});

// Use helper methods
await notificationService.createProjectInvitationNotification(
  userId,
  projectId,
  projectName,
  senderId,
  senderName,
  senderAvatar
);
```

### Using Notifications in Frontend

```jsx
import { useNotifications } from '../NotificationContext';

function MyComponent() {
  const { unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>You have {unreadCount} unread notifications</p>
    </div>
  );
}
```

## Testing

### Test Real-Time Notifications

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Login to the application
4. Open browser console to see WebSocket connection logs
5. Test notification: 
   ```bash
   curl -X POST http://localhost:3001/api/test/test-notification \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
6. Watch for popup notification in top-right corner

### Verify Features

- ✅ Notification popup appears
- ✅ Auto-dismisses after 5 seconds
- ✅ Badge count updates in sidebar
- ✅ Notifications page shows new notification
- ✅ Mark as read reduces unread count
- ✅ Click notification navigates to action URL

## WebSocket Events

### Client → Server
- `join_project`: Join project room
- `leave_project`: Leave project room
- `send_project_message`: Send chat message

### Server → Client
- `notification`: General in-app notification
- `message_notification`: Chat message notification
- `new_project_message`: Project chat message
- `user_typing_project`: Typing indicator

## Troubleshooting

### Notifications not appearing
1. Check WebSocket connection in browser console
2. Verify authentication token is valid
3. Check backend logs for WebSocket service initialization
4. Ensure NotificationProvider wraps your app

### Badge count not updating
1. Check NotificationContext is properly initialized
2. Verify `/api/notifications/unread-count` endpoint works
3. Check browser console for errors

### Popups not auto-dismissing
1. Check setTimeout is not being cleared
2. Verify component is not unmounting
3. Check browser console for JavaScript errors

## Future Enhancements

- [ ] Notification preferences per user
- [ ] Email digest for unread notifications
- [ ] Push notifications (browser API)
- [ ] Notification sounds
- [ ] Group notifications by type
- [ ] Notification archiving
- [ ] Advanced filtering options
- [ ] Notification templates

## Security Considerations

- Notifications are only sent to authenticated users
- WebSocket connections require valid JWT tokens
- Users can only access their own notifications
- XSS protection through proper HTML escaping
- CORS configured for allowed origins

## Performance

- WebSocket service maintains user socket mapping
- Notifications paginated on fetch
- Auto-cleanup of old popups
- Efficient MongoDB indexes on notification queries
- Rate limiting on API endpoints (if configured)

---

**Created**: 2025-10-28  
**Version**: 1.0.0  
**Status**: Production Ready
