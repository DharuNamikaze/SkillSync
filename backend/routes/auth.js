const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../src/models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      return res.redirect('/login?error=auth_failed');
    }
    
    const token = jwt.sign(
      {
        sub: req.user.id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
  }
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Google token verification endpoint
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ ok: false, error: 'Invalid token' });
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

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      ok: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ ok: false, error: 'Invalid token' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;