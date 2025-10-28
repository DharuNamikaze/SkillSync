# 🚀 CodeSandbox Integration - Quick Start

## ⚡ Get Running in 5 Minutes

### Step 1: Install CodeSandbox SDK
```powershell
cd D:\Capstone\SkillSync\backend
npm install @codesandbox/sdk
```

### Step 2: Get API Key
1. Go to https://codesandbox.io/t/api
2. Sign in / Create account
3. Click "Create API Key"
4. **Enable ALL scopes**
5. Copy the key (starts with `csb_v1_`)

### Step 3: Add to .env
Edit `backend/.env` and add:
```env
CODESANDBOX_API_KEY=csb_v1_your_copied_key_here
```

### Step 4: Restart Backend
```powershell
# Kill current backend process (Ctrl+C)
cd D:\Capstone\SkillSync\backend
npm run dev
```

### Step 5: Test It!
1. Open http://localhost:5173
2. Log in
3. Click "Create Project"
4. Fill form and create
5. **Wait 10-15 seconds** (sandbox is being created)
6. You'll be redirected to workspace with live CodeSandbox IDE!

---

## ✅ What to Expect

### Console Output (Backend)
```
🚀 Creating sandbox for project: My Awesome Project (template: react-ts)
✅ Sandbox created with ID: abc123xyz
✅ Initial files written to sandbox abc123xyz
✅ Workspace initialized for project 67123abc456def
```

### What You'll See (Frontend)
- Full CodeSandbox IDE embedded in browser
- File explorer, code editor, terminal all working
- Live preview tab with running app
- Real-time collaboration (multiple users can edit together!)

---

## 🐛 Quick Troubleshooting

### ❌ Backend Error: "CODESANDBOX_API_KEY not set"
**Fix**: Add API key to `backend/.env` and restart server

### ❌ "Workspace Initializing" Forever
**Fix**: Check backend console for errors. Sandbox creation takes 10-15 seconds first time.

### ❌ Authentication Token Error
**Fix**: Already fixed in code! If still happening, clear localStorage and re-login.

---

## 📖 Full Documentation

See [CODESANDBOX_INTEGRATION.md](./CODESANDBOX_INTEGRATION.md) for complete details.

---

## 🎉 That's It!

You now have:
- ✅ Cloud-based collaborative IDEs for every project
- ✅ Real-time code editing
- ✅ Live previews
- ✅ Automatic cleanup
- ✅ Template support (React, Vue, Node.js)

**Happy Coding! 🎨💻**
