// backend/routes/userRoutes.js
import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  uploadDocuments,
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const CLIENT_URL = "http://localhost:5174";
const JWT_SECRET = "kanakdeora";
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);

userRouter.post(
  '/update-profile',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
  ]),
  authUser,
  updateProfile
);

userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/upload-documents', upload.array('documents', 5), authUser, uploadDocuments);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);

// ✅ Forgot Password
userRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`; // ✅ no space

    await sendEmail(
      email,
      'Reset Your Password',
      `<p>Hello ${user.name},</p>
       <p>You requested a password reset. Click the link below:</p>
       <a href="${resetLink}" target="_blank">Reset Password</a>
       <p>This link will expire in 15 minutes.</p>`
    );

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Reset Password
userRouter.post('/reset-password', async (req, res) => {
  const { password, token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

export default userRouter;
