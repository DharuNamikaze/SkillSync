import { Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  bio?: string;
  title?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill extends Document {
  userId: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject extends Document {
  name: string;
  description: string;
  status: 'planning' | 'recruiting' | 'active' | 'completed' | 'paused';
  technologies: string[];
  members: {
    current: number;
    max: number;
    userIds: string[];
  };
  progress: number;
  deadline: Date;
  createdBy: string;
  department: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  metrics: {
    commits: number;
    issues: number;
    stars: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  userId: string;
  type: 'invitation' | 'task_assignment' | 'comment' | 'deadline' | 'achievement' | 'mention' | 'team_update' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  actionUrl: string;
  category: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface CreateUserRequest {
  googleId?: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface UpdateUserRequest {
  bio?: string;
  title?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}

export interface CreateSkillRequest {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface UpdateSkillRequest {
  name?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  technologies?: string[];
  maxMembers: number;
  deadline: string;
  department: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'planning' | 'recruiting' | 'active' | 'completed' | 'paused';
  technologies?: string[];
  maxMembers?: number;
  deadline?: string;
  department?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  progress?: number;
}

export interface CreateNotificationRequest {
  userId: string;
  type: 'invitation' | 'task_assignment' | 'comment' | 'deadline' | 'achievement' | 'mention' | 'team_update' | 'system';
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  actionUrl: string;
  category: string;
  metadata?: any;
}

export interface AuthRequest {
  user?: {
    id: string;
    googleId: string;
    email: string;
    name: string;
    picture: string;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ProjectQuery extends PaginationQuery {
  search?: string;
  status?: string;
  difficulty?: string;
}

export interface NotificationQuery extends PaginationQuery {
  filter?: string;
  unreadOnly?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
