# Backend API Documentation

## Overview
SkillSync Backend is a TypeScript-based Express API that powers user profiles, skills tracking, collaborative projects, notifications, and dashboard insights. It connects to MongoDB via Mongoose and secures protected routes using Bearer tokens (first-party JWT or Google ID tokens).

## Tech Stack
- Runtime: Node.js
- Framework: Express 5 (TypeScript)
- Database: MongoDB
- ORM/ODM: Mongoose
- Validation: express-validator
- Auth: Bearer tokens (HS256 JWT via JWT_SECRET and/or Google ID Token via GOOGLE_CLIENT_ID)
- Other: CORS, dotenv

## Project Structure
- backend/
  - src/
    - index.ts (app entrypoint, mounts /api, health endpoint, CORS, error handling)
    - utils/
      - database.ts (MongoDB connection)
    - middleware/
      - auth.ts (authenticateToken, optionalAuth)
      - errorHandler.ts (error handling, notFound)
      - validation.ts (express-validator rules)
    - routes/
      - index.ts (mounts resources under /api)
      - userRoutes.ts
      - skillRoutes.ts
      - projectRoutes.ts
      - notificationRoutes.ts
      - dashboardRoutes.ts
    - controllers/
      - userController.ts
      - skillController.ts
      - projectController.ts
      - notificationController.ts
      - dashboardController.ts
    - services/
      - userService.ts
      - skillService.ts
      - projectService.ts (integrates CodeSandbox)
      - notificationService.ts
      - codeSandboxService.ts
    - models/
      - User.ts
      - Skill.ts
      - Project.ts
      - Notification.ts
    - types/
      - index.ts (shared TypeScript types)

## Authentication and Authorization
- Scheme: Bearer token in Authorization header (Authorization: Bearer <token>)
- Verification logic:
  1) If JWT_SECRET is set, verify HS256 application-issued JWT.
  2) Otherwise (or if verification failed), verify as Google ID Token using GOOGLE_CLIENT_ID via google-auth-library.
- User resolution: Queries User collection by googleId (sub) or email from the token payload.
- Middlewares:
  - authenticateToken: required for protected routes; attaches req.user when valid.
  - optionalAuth: attaches req.user if a valid token is provided; otherwise continues unauthenticated.

## API Endpoints (Summary)
| Method | Endpoint                              | Description                              | Auth | Model         |
|-------:|----------------------------------------|------------------------------------------|:----:|---------------|
| GET    | /api/health                            | Health check                              | No   | —             |
| POST   | /api/users/upsert                      | Create or update a user                   | No   | User          |
| GET    | /api/users/profile                     | Get current user profile                  | Yes  | User          |
| PUT    | /api/users/profile                     | Update current user profile               | Yes  | User          |
| DELETE | /api/users/profile                     | Delete current user                       | Yes  | User          |
| GET    | /api/users                              | List users (paginated)                    | No   | User          |
| GET    | /api/skills                            | Get current user's skills                 | Yes  | Skill         |
| POST   | /api/skills                            | Create a skill                            | Yes  | Skill         |
| GET    | /api/skills/search                     | Search skills (q)                         | Yes  | Skill         |
| GET    | /api/skills/categories                 | Distinct categories for current user      | Yes  | Skill         |
| GET    | /api/skills/category/:category         | Skills by category                        | Yes  | Skill         |
| GET    | /api/skills/:id                        | Get a skill by ID                         | Yes  | Skill         |
| PUT    | /api/skills/:id                        | Update a skill                            | Yes  | Skill         |
| DELETE | /api/skills/:id                        | Delete a skill                            | Yes  | Skill         |
| GET    | /api/projects                          | List projects (filter, search, paginate)  | No   | Project       |
| GET    | /api/projects/stats                    | Project status counts                     | No   | Project       |
| GET    | /api/projects/:id                      | Get project by ID                         | No   | Project       |
| POST   | /api/projects                          | Create project                            | Yes  | Project       |
| GET    | /api/projects/user/projects            | Current user's projects                    | Yes  | Project       |
| PUT    | /api/projects/:id                      | Update project (creator only)             | Yes  | Project       |
| DELETE | /api/projects/:id                      | Delete project (creator only)             | Yes  | Project       |
| POST   | /api/projects/:id/join                 | Join a project                            | Yes  | Project       |
| POST   | /api/projects/:id/leave                | Leave a project                           | Yes  | Project       |
| GET    | /api/notifications                     | List notifications (filter, unread, page) | Yes  | Notification  |
| GET    | /api/notifications/unread-count        | Unread notifications count                | Yes  | Notification  |
| GET    | /api/notifications/:id                 | Get notification by ID                    | Yes  | Notification  |
| PUT    | /api/notifications/:id/read            | Mark notification as read                 | Yes  | Notification  |
| PUT    | /api/notifications/mark-all-read       | Mark all as read                          | Yes  | Notification  |
| DELETE | /api/notifications/:id                 | Delete notification                       | Yes  | Notification  |
| GET    | /api/dashboard/stats                   | Public dashboard stats (+user if authed)  | Opt  | —             |
| GET    | /api/dashboard/activities              | Recent activities (mock)                   | Yes  | —             |
| GET    | /api/dashboard/tasks                   | Upcoming tasks (mock)                      | Yes  | —             |
| GET    | /api/dashboard/skills                  | Skill progress (live or mock)             | Yes  | Skill         |

Auth: Yes = Bearer token required; No = public; Opt = optional auth (adds user-specific data when available).

## Detailed API Descriptions

### Health
- GET /api/health
  - Description: API health check.
  - Auth: No
  - Response 200: { ok: true, message, timestamp }

### Users
- POST /api/users/upsert
  - Description: Creates or updates a user by email or googleId.
  - Auth: No
  - Validation: email (email), name (1..100), picture (url, optional), googleId (optional)
  - Request body example:
    {
      "email": "user@example.com",
      "name": "Alex Doe",
      "picture": "https://example.com/avatar.png",
      "googleId": "google-sub-123"
    }
  - Responses:
    - 200: { ok: true, data: User, message }
    - 400: { ok: false, error }

- GET /api/users/profile
  - Description: Get the authenticated user's profile.
  - Auth: Yes (Bearer)
  - Responses:
    - 200: { ok: true, data: User, message }
    - 401/404: { ok: false, error }

- PUT /api/users/profile
  - Description: Update authenticated user's profile fields.
  - Auth: Yes
  - Validation: bio (<=500), title (<=100), socialLinks.github (url), socialLinks.linkedin (url)
  - Request body example:
    {
      "bio": "Full-stack engineer",
      "title": "Senior Developer",
      "socialLinks": { "github": "https://github.com/username" }
    }
  - Responses: 200 with updated User; 400/401/404 errors

- DELETE /api/users/profile
  - Description: Delete current user account.
  - Auth: Yes
  - Responses: 200 { ok: true, message }

- GET /api/users
  - Description: List users with pagination.
  - Auth: No (optional auth middleware)
  - Query: page (int, default 1), limit (int, default 10)
  - Response: { ok: true, data: User[], pagination }

### Skills (all require Auth)
- GET /api/skills
  - Description: List current user's skills.
  - Responses: 200 { ok: true, data: Skill[] }

- POST /api/skills
  - Description: Create a new skill for current user.
  - Validation: name (1..50), level in [Beginner, Intermediate, Advanced, Expert], category (1..50)
  - Request example:
    { "name": "React", "level": "Advanced", "category": "Frontend" }
  - Response: 201 { ok: true, data: Skill }

- GET /api/skills/search?q=
  - Description: Search current user's skills by name or category.
  - Query: q (required)
  - Response: 200 { ok: true, data: Skill[] }

- GET /api/skills/categories
  - Description: Distinct categories for current user.
  - Response: 200 { ok: true, data: string[] }

- GET /api/skills/category/:category
  - Description: Skills by category for current user.
  - Response: 200 { ok: true, data: Skill[] }

- GET /api/skills/:id
  - Description: Get single skill by ID.
  - Params: id (MongoID)
  - Response: 200 { ok: true, data: Skill }

- PUT /api/skills/:id
  - Description: Update skill fields.
  - Validation: name (optional), level (optional), category (optional)
  - Response: 200 { ok: true, data: Skill }

- DELETE /api/skills/:id
  - Description: Delete skill by ID.
  - Response: 200 { ok: true, message }

### Projects
- GET /api/projects
  - Description: Public list of projects with search and filter.
  - Query: page, limit, search, status [planning|recruiting|active|completed|paused], difficulty [beginner|intermediate|advanced]
  - Response: 200 { ok: true, data: Project[], pagination }

- GET /api/projects/stats
  - Description: Aggregate counts by project status.
  - Response: 200 { ok: true, data: { total, active, recruiting, completed, planning } }

- GET /api/projects/:id
  - Description: Get project by ID.
  - Response: 200 { ok: true, data: Project }

- POST /api/projects
  - Description: Create a project (and initialize CodeSandbox workspace when configured).
  - Auth: Yes
  - Validation: name (1..100), description (10..1000), technologies (array, optional), maxMembers (1..50), deadline (ISO date), department (1..50), difficulty (enum), tags (array, optional)
  - Additional required model fields: templateId (string), sandboxTemplate (string)
  - Request example:
    {
      "name": "SkillSync Platform",
      "description": "Collaborative learning platform",
      "technologies": ["React", "Node.js"],
      "maxMembers": 5,
      "deadline": "2025-12-31T00:00:00.000Z",
      "department": "Engineering",
      "difficulty": "intermediate",
      "tags": ["education", "collaboration"],
      "templateId": "react-app",
      "sandboxTemplate": "create-react-app-typescript"
    }
  - Response: 201 { ok: true, data: Project }

- GET /api/projects/user/projects
  - Description: Projects created by or joined by current user.
  - Auth: Yes
  - Response: 200 { ok: true, data: Project[] }

- PUT /api/projects/:id
  - Description: Update a project (only creator can update).
  - Auth: Yes
  - Response: 200 { ok: true, data: Project }

- DELETE /api/projects/:id
  - Description: Delete a project (only creator can delete).
  - Auth: Yes
  - Response: 200 { ok: true, message }

- POST /api/projects/:id/join
  - Description: Join the specified project if capacity allows and not already a member.
  - Auth: Yes
  - Response: 200 { ok: true, data: Project }

- POST /api/projects/:id/leave
  - Description: Leave the specified project.
  - Auth: Yes
  - Response: 200 { ok: true, data: Project }

### Notifications (all require Auth)
- GET /api/notifications
  - Description: List notifications for current user.
  - Query: page (1..), limit (1..100), filter [all|projects|tasks|comments|team|system], unreadOnly (boolean)
  - Response: 200 { ok: true, data: Notification[], pagination }

- GET /api/notifications/unread-count
  - Description: Get unread notifications count for current user.
  - Response: 200 { ok: true, data: { count: number } }

- GET /api/notifications/:id
  - Description: Get notification by ID for current user.
  - Response: 200 { ok: true, data: Notification }

- PUT /api/notifications/:id/read
  - Description: Mark a notification as read.
  - Response: 200 { ok: true, data: Notification }

- PUT /api/notifications/mark-all-read
  - Description: Mark all notifications as read for current user.
  - Response: 200 { ok: true, data: { count: number } }

- DELETE /api/notifications/:id
  - Description: Delete notification by ID.
  - Response: 200 { ok: true, message }

### Dashboard
- GET /api/dashboard/stats
  - Description: Public stats; returns additional user-specific stats when authenticated.
  - Auth: Optional
  - Response: 200 { ok: true, data: { projectsCompleted, projectsInProgress, totalProjects, totalTeams, ... } }

- GET /api/dashboard/activities
  - Description: Recent activities (mock data).
  - Auth: Yes

- GET /api/dashboard/tasks
  - Description: Upcoming tasks (mock data).
  - Auth: Yes

- GET /api/dashboard/skills
  - Description: Skill progress: real data if available, otherwise mock fallback.
  - Auth: Yes

## Database Models

### Users
- Collection: users
- Fields:
  - id (ObjectId): primary key (serialized as id)
  - googleId (String, unique, sparse)
  - email (String, unique, required)
  - name (String, required)
  - picture (String)
  - bio (String)
  - title (String)
  - socialLinks.github (String)
  - socialLinks.linkedin (String)
  - createdAt, updatedAt (Date)

### Skills
- Collection: skills
- Fields:
  - id (ObjectId)
  - userId (String, required)
  - name (String, required)
  - level (String enum: Beginner|Intermediate|Advanced|Expert, required)
  - category (String, required)
- Indexes: { userId }, { userId, category }, { name }
- Relationship: Skill.userId -> Users.id (string reference)

### Projects
- Collection: projects
- Fields:
  - id (ObjectId)
  - name (String, required)
  - description (String, required)
  - status (String enum: planning|recruiting|active|completed|paused, default recruiting)
  - technologies (String[])
  - templateId (String, required)
  - sandboxTemplate (String, required)
  - isPublic (Boolean, default true)
  - workspace.ideUrl, workspace.sandboxId, workspace.embedUrl, workspace.editUrl (String)
  - members.current (Number), members.max (Number, required), members.userIds (String[])
  - progress (Number 0..100)
  - deadline (Date, required)
  - createdBy (String, required)
  - department (String, required)
  - difficulty (String enum: beginner|intermediate|advanced, required)
  - tags (String[])
  - metrics.commits/issues/stars (Number, default 0)
- Indexes: { createdBy }, { status }, { difficulty }, { members.userIds }, text index on name/description/technologies
- Relationships:
  - Project.createdBy -> Users.id (string reference)
  - Project.members.userIds[] -> Users.id (string references)

### Notifications
- Collection: notifications
- Fields:
  - id (ObjectId)
  - userId (String, required)
  - type (String enum: invitation|task_assignment|comment|deadline|achievement|mention|team_update|system, required)
  - title (String, required)
  - message (String, required)
  - isRead (Boolean, default false)
  - priority (String enum: low|medium|high, default medium)
  - sender.id (String, required), sender.name (String, required), sender.avatar (String), sender.role (String)
  - actionUrl (String, required)
  - category (String, required)
  - metadata (Mixed)
- Indexes: { userId, isRead }, { userId, category }, { userId, createdAt: -1 }
- Relationship: Notification.userId -> Users.id (string reference)

## Environment Variables
- PORT: Server port
- FRONTEND_URL: Allowed CORS origin
- MONGODB_URI: MongoDB connection string
- MONGODB_DB: Optional database name override
- JWT_SECRET: HS256 secret for app-issued JWTs (optional if using only Google ID tokens)
- GOOGLE_CLIENT_ID: Google OAuth client ID for verifying Google ID tokens
- CODESANDBOX_API_KEY: Optional API key for CodeSandbox integration (mock used when missing)

## Run Instructions
- Install dependencies: npm install
- Development: npm run dev (runs ts-node src/index.ts)
- Production build: npm run build (outputs dist/), then npm start
- Ensure environment variables are configured (e.g., in backend/.env)

Example .env:
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=skillsync
JWT_SECRET=replace_with_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CODESANDBOX_API_KEY=

## Error Handling
- Consistent JSON errors via errorHandler middleware: { ok: false, error, stack? }
- Validation errors return 400 with details from express-validator
- Auth failures return 401/403 with a descriptive error

## Notes and Caveats
- Project creation requires templateId and sandboxTemplate (per Project model) even though types may not mark them required.
- Some dashboard endpoints return mock data until corresponding services are implemented.
