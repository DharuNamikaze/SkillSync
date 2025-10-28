import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import Project from '../models/Project';
import { AppError } from '../utils/AppError';

export const validateProjectId = async (req: Request, res: Response, next: NextFunction) => {
  console.log('validateProjectId middleware:', {
    params: req.params,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });

  const projectId = req.params.id || req.params.projectId;

  if (!projectId) {
    return next(new AppError('Project ID is required', 400));
  }

  if (!isValidObjectId(projectId)) {
    return next(new AppError('Invalid project ID format', 400));
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if the user is a member of the project
    if (!project.members.userIds.includes(req.user?.id || '')) {
      return next(new AppError('You are not a member of this project', 403));
    }

    // Attach project to request for future use
    req.project = project;
    next();
  } catch (error) {
    next(new AppError('Error validating project access', 500));
  }
};