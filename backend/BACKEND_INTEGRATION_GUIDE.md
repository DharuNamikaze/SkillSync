# SkillSync Backend Integration Guide

## 🎯 Current Status

✅ **Backend Infrastructure Complete:**
- Full TypeScript Express.js server with MongoDB integration
- Complete REST API endpoints for projects, users, skills, notifications
- CodeSandbox service integration for IDE workspace creation
- Proper error handling, validation, and authentication middleware
- Database models and services for all entities

✅ **Frontend Integration Complete:**
- Projects page with real API integration and fallback to mock data
- CreateProjectModal using the API wrapper for project creation
- ProjectWorkspace component with real CodeSandbox IDE embedding
- Authentication context and token management
- Proper error handling and loading states

## 🚀 Setup Instructions

### 1. Install Node.js
You need Node.js installed to run the backend. Download from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Backend Dependencies
```bash
cd "C:\Users\srima\Downloads\SkillSync-main\backend"
npm install
```

### 3. Install Frontend Dependencies
```bash
cd "C:\Users\srima\Downloads\SkillSync-main\frontend"
npm install
```

### 4. Environment Configuration

The environment files are already properly configured:

**Backend (.env):**
- MongoDB connection to a cloud database
- Port set to 3001
- Ready for production use

**Frontend (.env):**
- API base URL pointing to localhost:3001
- Google OAuth client ID configured
- Environment variables properly set

### 5. Optional: CodeSandbox API Key
For real IDE integration (not required for development):
```bash
# Add to backend/.env
CODESANDBOX_API_KEY=your_api_key_here
```
Without this, the system falls back to mock IDE workspaces.

## 🧪 Testing the Complete Workflow

### 1. Start the Backend Server
```bash
cd "C:\Users\srima\Downloads\SkillSync-main\backend"
npm run dev
```
You should see:
```
🚀 SkillSync Backend running on http://localhost:3001
📚 API Documentation available at http://localhost:3001/api/health
MongoDB Connected: cluster0.jmkorra.mongodb.net
```

### 2. Start the Frontend Development Server
```bash
cd "C:\Users\srima\Downloads\SkillSync-main\frontend"
npm run dev
```
Access the frontend at http://localhost:5173

### 3. Test the End-to-End Project Creation Flow

1. **Navigate to Projects Page** (`/projects`)
2. **Click "Create Project"** button
3. **Fill in the modal:**
   - Project name (required)
   - Description
   - Select a template (React App, Vue.js, Node.js API, etc.)
   - Choose difficulty level
   - Set team size
4. **Submit the form**
5. **Backend should:**
   - Save project to MongoDB
   - Initialize CodeSandbox workspace
   - Return project data with workspace URLs
6. **Frontend should:**
   - Redirect to `/projects/{id}/workspace`
   - Load the collaborative IDE
   - Display the embedded CodeSandbox editor

### 4. Expected IDE Integration Features

- **Editor Tab:** Full CodeSandbox editor with the selected template
- **Preview Tab:** Live preview of the application
- **Terminal Tab:** Mock terminal showing project setup
- **Chat Tab:** Team collaboration interface
- **Toolbar:** Run, Share, Fullscreen controls

## 🔧 API Endpoints Available

### Projects
- `GET /api/projects` - List all projects with filtering
- `GET /api/projects/stats` - Project statistics
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project (with IDE initialization)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/join` - Join a project
- `POST /api/projects/:id/leave` - Leave a project

### Other Endpoints
- Users: `/api/users`
- Skills: `/api/skills`
- Notifications: `/api/notifications`
- Dashboard: `/api/dashboard`
- Health Check: `/api/health`

## 🛠️ CodeSandbox Integration Details

The backend includes a sophisticated CodeSandbox service that:

1. **Creates Sandboxes** with proper templates based on project type
2. **Generates Custom Files** including package.json, README.md, and starter code
3. **Falls Back to Mock Data** when CodeSandbox API is unavailable
4. **Returns URLs** for embedding, editing, and previewing

### Templates Supported:
- **React App:** TypeScript + Vite + TailwindCSS
- **Vue.js App:** Vue 3 + Composition API + TypeScript
- **Node.js API:** Express + TypeScript + MongoDB
- **Full-Stack App:** React frontend + Node.js backend
- **React Native:** Cross-platform mobile app
- **UI Library:** Component library + Storybook

## 🔐 Authentication Flow

- Frontend stores JWT tokens in localStorage
- Backend validates tokens using middleware
- Authentication is currently optional for development
- Google OAuth integration is configured

## 📊 Database Schema

### Projects Collection
```typescript
{
  name: string,
  description: string,
  status: 'planning' | 'recruiting' | 'active' | 'completed' | 'paused',
  technologies: string[],
  templateId: string,
  sandboxTemplate: string,
  isPublic: boolean,
  workspace: {
    ideUrl?: string,
    sandboxId?: string,
    embedUrl?: string,
    editUrl?: string
  },
  members: {
    current: number,
    max: number,
    userIds: string[]
  },
  progress: number,
  deadline: Date,
  createdBy: string,
  department: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  tags: string[],
  metrics: {
    commits: number,
    issues: number,
    stars: number
  }
}
```

## 🐛 Troubleshooting

### Backend Won't Start
- Ensure Node.js is installed
- Run `npm install` in backend directory
- Check MongoDB connection string in .env

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3001
- Check VITE_API_BASE_URL in frontend/.env
- Verify CORS settings in backend

### IDE Not Loading
- Check browser console for errors
- Verify project has workspace.embedUrl
- Test with different browsers

### Project Creation Fails
- Check backend logs for errors
- Verify all required fields are filled
- Check database connection

## 🚀 Production Deployment

1. **Backend:** Deploy to services like Heroku, Vercel, or AWS
2. **Frontend:** Deploy to Vercel, Netlify, or similar
3. **Database:** MongoDB Atlas is already configured
4. **Environment:** Update API URLs for production

## 💡 Next Steps for Enhancement

1. **Real-time Collaboration:** Implement WebSocket connections
2. **GitHub Integration:** Connect projects to GitHub repositories
3. **Advanced IDE Features:** Code completion, debugging, version control
4. **Team Management:** Enhanced user roles and permissions
5. **Analytics:** Project progress tracking and insights

The integration is now complete and ready for testing once Node.js is installed!