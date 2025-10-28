# SkillSync

A collaborative platform for skill development and project management, designed to help teams track progress, manage projects, and synchronize skills across team members.

## Features

- **User Authentication**: Secure login with Google OAuth
- **Dashboard**: Visual overview of projects, tasks, and skill progress
- **Project Management**: Create, track, and complete projects
- **Team Collaboration**: Form teams and collaborate on projects
- **Skill Tracking**: Monitor skill development and achievements
- **Messaging**: In-app communication between team members
- **Calendar**: Schedule and manage project timelines
- **Notifications**: Stay updated on project activities
- **Dark/Light Theme**: Customizable UI appearance

## Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router v6** - Client-side routing
- **TailwindCSS 4** - Utility-first CSS
- **Vite 7** - Lightning-fast build tool
- **Socket.IO Client** - Real-time WebSocket communication
- **Lucide React** - Beautiful icons
- **JWT Authentication** - Secure token-based auth

### Backend
- **Node.js with Express 5** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB with Mongoose** - NoSQL database
- **Socket.IO** - Real-time WebSocket server
- **JWT** - Authentication tokens
- **Google OAuth 2.0** - Social authentication

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Backend Setup

```bash
# Clone the repository (or navigate to your project)
cd SkillSync/backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and configure:
# - MONGODB_URI (local MongoDB or Atlas)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# - JWT_SECRET (change from default!)

# Start development server
npm run dev
```

The backend will start on **http://localhost:3001** with WebSocket support.

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and configure:
# - VITE_API_URL=http://localhost:3001/api
# - VITE_GOOGLE_CLIENT_ID (same as backend)

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173** with hot reload.

## Usage

### Authentication

The application uses Google OAuth for authentication. Users can sign in with their Google accounts, and their information is securely stored in the MongoDB database.

### Dashboard

The dashboard provides a comprehensive overview of:
- Projects completed and in progress
- Tasks status
- Team activities
- Skill development progress
- Recent activities

### Project Management

Create new projects, assign team members, track progress, and manage tasks all from the Projects section.

```javascript
// Example of creating a new project (frontend code)
const createProject = async (projectData) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(projectData)
  });
  return response.json();
};
```

## Project Structure

```
├── backend/                # Node.js Express backend
│   ├── src/                # TypeScript source files
│   │   └── index.ts        # Main server file
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration
│
└── frontend/              # React frontend
    ├── public/             # Static assets
    ├── src/                # React source files
    │   ├── components/     # UI components
    │   ├── assets/         # Images and other assets
    │   ├── App.jsx         # Main application component
    │   ├── AuthContext.jsx # Authentication context
    │   ├── ThemeContext.jsx # Theme management
    │   └── main.jsx        # Application entry point
    ├── package.json        # Frontend dependencies
    └── vite.config.js      # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT