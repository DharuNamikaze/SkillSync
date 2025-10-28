# Multi-User Notification Testing Guide

## How It Works

When **User A** sends a message in a project:
1. ✅ Backend receives the message
2. ✅ Backend finds all users in that project room
3. ✅ Backend sends a `message_notification` event to **all other users** (except User A)
4. ✅ Each user's browser receives the notification
5. ✅ If notifications are enabled, a browser notification appears

## Testing with Two Users

### Setup (One-Time)

1. **Open Two Browsers** (or Incognito/Private windows)
   - Browser 1: Chrome
   - Browser 2: Firefox (or Chrome Incognito)

2. **Log in as Different Users**
   - Browser 1: User A (e.g., your main account)
   - Browser 2: User B (e.g., another test account)

### Step-by-Step Test

#### Browser 1 (User A):
1. Navigate to Messages page
2. Select a project (e.g., "Project Alpha")
3. Click **"Enable Notifications"** button
4. Allow notifications when browser prompts
5. Button should turn blue and say "Notifications ON"
6. Click the green **"Test 🧪"** button to verify notifications work
7. Keep browser console open (F12)

#### Browser 2 (User B):
1. Navigate to Messages page
2. Select **the same project** (e.g., "Project Alpha")
3. Click **"Enable Notifications"** button
4. Allow notifications when browser prompts
5. Type a message: "Hello from User B!"
6. Send the message
7. Keep browser console open (F12)

#### Expected Result in Browser 1 (User A):
You should see:
1. ✅ A **browser notification** appears with:
   - Title: "User B • Project Alpha"
   - Body: "Hello from User B!"
2. ✅ The message appears in the chat
3. ✅ Console logs show:
   ```
   🔔 Global notification received: {type: 'new_message', ...}
   🔔 Showing notification for: User B Hello from User B!
   🔔 showMessageNotification called: {...}
   🔔 Notification object created successfully
   ```

#### Expected Result in Browser 2 (User B):
1. ✅ Message appears in the chat
2. ❌ **NO notification** (because you sent it yourself)
3. ✅ Console shows the message was sent successfully

### Backend Console Logs

In your backend terminal, you should see:
```
Broadcasting project message to room: project:69009046e751f1c0cff25d96 {...}
🔔 Project users in room 69009046e751f1c0cff25d96: ['user-a-id', 'user-b-id']
🔔 Checking user user-a-id - is sender: false
🔔 User user-a-id socket ID: socket-xyz
🔔 Sending notification to user user-a-id: {...}
🔔 Checking user user-b-id - is sender: true
🔔 Total notifications sent: 1
```

## Testing with More Users

### Add a Third User:
1. Open a third browser
2. Log in as User C
3. Join the same project
4. Enable notifications
5. Have User B send another message
6. **Both User A and User C** should receive notifications
7. User B should NOT receive a notification

## Troubleshooting

### Issue: No notification received

**Check Browser 1 (Receiver) Console:**
- Look for: `🔔 Global notification received:`
  - **If NOT present**: WebSocket not receiving the event from backend
  - **If present**: Check next step

- Look for: `🔔 Showing notification for:`
  - **If NOT present**: Either `notificationsEnabled: false` or wrong project
  - **If present**: Check permission

**Check Browser 2 (Sender) Console:**
- Confirm message was sent: `📤 Sending project message via WebSocket...`
- Confirm message was received: `✅ Message sent successfully`

**Check Backend Console:**
- Look for: `🔔 Total notifications sent: X`
- If `X = 0`: No other users in project room
- If `X > 0`: Notifications were sent to backend

### Issue: "No other users in project room"

**Solution:**
1. Make sure **both users joined the same project**
2. Check backend logs for:
   ```
   User <user-id> joined project <project-id>
   ```
3. Both users should have joined before sending messages

### Issue: Notification shows but then disappears

**This is normal!** Notifications auto-close after 5 seconds.

### Issue: Notifications not enabled

**Symptoms:**
- Button says "Enable Notifications" (gray)
- Console shows: `notificationsEnabled: false`

**Solution:**
1. Click the "Enable Notifications" button
2. Click "Allow" in browser prompt
3. If blocked, go to browser settings and allow notifications for your site

## Visual Confirmation

✅ **Working correctly:**
```
User A -> Sends message -> ❌ No notification (sender)
User B -> Receives message -> ✅ Browser notification appears
User C -> Receives message -> ✅ Browser notification appears
```

❌ **Not working:**
```
User A -> Sends message
User B -> No notification appears
User B console: No "🔔 Global notification received"
```

## Key Points

1. ✅ Sender **never** receives their own notification
2. ✅ All **other project members** receive notifications
3. ✅ Users must have notifications enabled
4. ✅ Both users must be in the **same project**
5. ✅ Users must **join the project** (open the Messages page and select it)

## Quick Test Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Two different user accounts
- [ ] Both users logged in to different browsers
- [ ] Both users on Messages page
- [ ] Both users selected **the same project**
- [ ] Both users clicked "Enable Notifications"
- [ ] Both users allowed browser permission
- [ ] One user sends a message
- [ ] Other user sees browser notification
- [ ] Backend console shows notifications sent
- [ ] Frontend console shows notification received

## Production Notes

In production, you may want to:
- Only show notifications when tab is not visible: `document.hidden === true`
- Add sound alerts
- Show unread message count
- Persist notification preferences
- Add "Do Not Disturb" mode
