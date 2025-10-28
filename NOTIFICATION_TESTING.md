# Testing Notification Feature - Step by Step Guide

## Prerequisites
- Backend server running on http://localhost:3001
- Frontend running on http://localhost:5173 (or your configured port)
- Two different browser windows or two different users

## Testing Steps

### Step 1: Enable Notifications
1. Open the SkillSync app in your browser
2. Navigate to the Messages page
3. Select any project from the sidebar
4. Look for the **bell icon** in the chat header (top right area)
5. Click the bell icon
6. Your browser will show a permission prompt - **Click "Allow"**
7. The bell icon should turn **blue** (indicating notifications are enabled)
8. Check the browser console - you should see:
   ```
   🔔 Requesting notification permission...
   🔔 Permission granted: true
   ```

### Step 2: Test Notifications

#### Option A: Using Two Browser Windows (Same User)
1. Open the same project in two browser windows (or tabs)
2. In the first window, keep it **visible/active**
3. In the second window, send a message
4. You should see the notification appear in the first window
5. Check the browser console for debug logs

#### Option B: Using Two Different Users (Recommended)
1. Open the app in two different browsers (e.g., Chrome and Firefox)
2. Log in as **User A** in one browser
3. Log in as **User B** in the other browser
4. Both users join the same project
5. Have **User B** send a message
6. **User A** should receive a notification (even if the tab is visible during testing)
7. Check console logs in User A's browser

### Step 3: Check Console Logs

When a message is received, you should see these logs in the console:

```javascript
✅ Received project message via WebSocket: {sender: {...}, content: "test message"}
🔔 Notification check: {
  isFromAnotherUser: true,
  senderId: "123...",
  currentUserId: "456...",
  notificationsEnabled: true,
  documentHidden: false
}
🔔 Attempting to show notification: John Doe test message
🔔 showMessageNotification called: {senderName: "John Doe", ...}
🔔 Can show notification: true
🔔 Notification permission: "granted"
🔔 showNotification called: {title: "John Doe • Project Name", ...}
🔔 Creating notification with options: {...}
🔔 Notification object created successfully
```

## Troubleshooting

### Issue: Bell icon is gray (notifications disabled)
**Solution:**
- Click the bell icon to request permission
- If permission is blocked, you need to reset it in browser settings:
  - Chrome: Settings → Privacy and security → Site Settings → Notifications
  - Firefox: Settings → Privacy & Security → Permissions → Notifications

### Issue: No notification appears
**Check:**
1. Is the bell icon blue? (notifications enabled)
2. Open browser console and check for error messages
3. Look for the debug logs mentioned above
4. Check if "Do Not Disturb" mode is enabled on your OS
5. Verify the message is from a different user (not yourself)

### Issue: Console shows "Notifications not permitted"
**Solution:**
- Browser has blocked notifications for this site
- Reset permissions in browser settings
- Click the bell icon again to re-request permission

### Issue: Console shows "isFromAnotherUser: false"
**Problem:** You're seeing your own messages
**Solution:** Use two different user accounts to test

### Issue: No console logs appear
**Problem:** WebSocket not connected or message not being sent
**Check:**
1. Backend server is running
2. WebSocket connection is established (check for "WebSocket connected" in console)
3. Message is being sent successfully

## Expected Behavior

✅ **When it's working correctly:**
- Bell icon is blue
- Console shows all debug logs
- Browser notification appears with:
  - Sender name
  - Project name
  - Message content (truncated to 100 characters)
- Clicking notification focuses the browser window
- Notification auto-closes after 5 seconds

## Note on Document Visibility

Currently, notifications are set to appear **regardless of tab visibility** for easier testing. In the original design, they only appear when `document.hidden === true` (tab is not visible). To restore that behavior, change line 170 in Messages.jsx from:

```javascript
if (message.sender?.id !== user?.id && notificationsEnabled) {
```

to:

```javascript
if (message.sender?.id !== user?.id && notificationsEnabled && document.hidden) {
```

## Browser Compatibility

Tested on:
- ✅ Chrome/Edge 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ❌ Internet Explorer (not supported)
