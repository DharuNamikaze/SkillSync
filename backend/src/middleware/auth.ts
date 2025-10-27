import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import User from '../models/User';
import { createError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'skillsync-secret-key-2025';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError('Invalid token format', 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.id).select('-__v').lean();
      
      if (!user) {
        throw createError('User not found', 401);
      }

      (req as AuthRequest).user = {
        id: decoded.id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture
      };

      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw createError('Invalid token', 401);
      }
      if (err instanceof jwt.TokenExpiredError) {
        throw createError('Token expired', 401);
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// Legacy auth middleware - will be deprecated in favor of requireAuth
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: 'Access token required'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.id).select('-__v').lean();
      
      if (!user) {
        return res.status(401).json({
          ok: false,
          error: 'User not found'
        });
      }

      (req as AuthRequest).user = {
        id: decoded.id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture
      };

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          ok: false,
          error: 'Token expired'
        });
      }
      throw err;
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({
      ok: false,
      error: 'Invalid or expired token'
    });
  }
};

export const createAuthToken = (user: any): string => {
  // Create a token with user information
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      googleId: user.googleId
    },
    JWT_SECRET,
    { expiresIn: '30d' } // Token expires in 30 days
  );
};
