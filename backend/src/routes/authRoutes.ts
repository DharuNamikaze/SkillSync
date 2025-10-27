import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { createAuthToken } from '../middleware/auth';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/verify-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw createError('Token is required', 400);
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw createError('Invalid token', 400);
    }

    // Find or create user
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });
    }

    // Create an auth token
    const authToken = createAuthToken(user);

    res.json({
      ok: true,
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    next(error);
  }
});

export default router;