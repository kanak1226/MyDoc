import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

const JWT_SECRET = "kanakdeora";
const router = express.Router();

const client = new OAuth2Client(
  "399526421214-d77mi83qmjd4drv8fg7en6gokuuc0itr.apps.googleusercontent.com"
);

// ---------------- Google Login ----------------
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "399526421214-d77mi83qmjd4drv8fg7en6gokuuc0itr.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        googleId: sub,
        isGoogleUser: true,
      });
    }

    const appToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token: appToken, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid Google token' });
  }
});

// ---------------- Forgot Password ----------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '15m', // token valid for 15 minutes
    });

    const resetUrl = `http://localhost:5174/reset-password/${token}`;
    const message = `Click here to reset your password: ${resetUrl}`;

    await sendEmail(user.email, 'Password Reset', message);

    res.send({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// ---------------- Reset Password ----------------
router.post('/reset-password', async (req, res) => {
  const { password, token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).send({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Invalid or expired token' });
  }
});

export default router;
