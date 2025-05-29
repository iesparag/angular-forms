import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import env from '../config/config.js';
import { registerUser, loginUser, forgotPassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log('Google callback - User:', req.user);
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log('Generated token:', token);

    // Redirect to frontend with token
    res.redirect(`http://localhost:4200/auth/google-callback?token=${token}&user=${JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    })}`);
  }
);

export default router;
