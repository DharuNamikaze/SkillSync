import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Access token required' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Find user in database
    const user = await User.findOne({ 
      $or: [
        { googleId: decoded.sub },
        { email: decoded.email }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'User not found' 
      });
    }

    // Add user to request object
    (req as AuthRequest).user = {
      id: (user as any)._id.toString(),
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      ok: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      const user = await User.findOne({ 
        $or: [
          { googleId: decoded.sub },
          { email: decoded.email }
        ]
      });

      if (user) {
        (req as AuthRequest).user = {
          id: (user as any)._id.toString(),
          googleId: user.googleId,
          email: user.email,
          name: user.name,
          picture: user.picture
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
