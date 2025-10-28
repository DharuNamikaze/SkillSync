import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validateMessage = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return next(new AppError('Message content is required', 400));
  }

  if (content.trim().length === 0) {
    return next(new AppError('Message content cannot be empty', 400));
  }

  if (content.length > 5000) {
    return next(new AppError('Message content cannot exceed 5000 characters', 400));
  }

  next();
};