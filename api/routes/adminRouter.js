import express from 'express';
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard
} from '../controllers/adminController.js';

import {
  changeAvailablity,
  deleteDoctor
} from '../controllers/doctorController.js';

import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import UserModel from '../models/userModel.js';

const adminRouter = express.Router();

// Admin login
adminRouter.post('/login', loginAdmin);

// Protected Routes (require admin auth)
adminRouter.post('/add-doctor', authAdmin, upload.single('profileImage'), addDoctor);
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailablity);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);

// NEW: Get single patient by ID
adminRouter.get('/patient/:id', authAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default adminRouter;
