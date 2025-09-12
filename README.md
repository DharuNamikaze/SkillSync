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
- React 19
- React Router v6
- TailwindCSS 4
- Vite 7
- Lucide React (icons)
- JWT Authentication

### Backend
- Node.js with Express 5
- TypeScript
- MongoDB with Mongoose
- JWT for authentication

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/skillsync.git
cd skillsync

# Setup backend
cd backend
npm install

# Create .env file with the following variables
# PORT=3001
# MONGODB_URI=your_mongodb_connection_string
# MONGODB_DB=skillsync

# Start development server
npm run dev
```

### Frontend Setup

```bash
# From the project root
cd frontend
npm install

# Create .env file with
# VITE_API_BASE_URL=http://localhost:3001

# Start development server
npm run dev
```

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