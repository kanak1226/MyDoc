import express from 'express';
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  getPatientById // ✅ NEW controller
} from '../controllers/doctorController.js';

import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// Doctor login
doctorRouter.post("/login", loginDoctor);
//doctorRouter.get("/", doctorList); // Shortcut for frontend access


// Appointment management
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

// Availability
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);

// Dashboard
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

// Doctor profile
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// Doctor list (public/patient-side)
doctorRouter.get("/list", doctorList);

// ✅ NEW: Get details of a specific patient (for doctor)
doctorRouter.get("/patient/:id", authDoctor, getPatientById);

export default doctorRouter;
