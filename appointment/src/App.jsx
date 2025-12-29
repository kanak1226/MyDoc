import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Login from './pages/Login';
import Myprofile from './pages/Myprofile';
import Myappointments from './pages/Myappointments';
import Appointment from './pages/Appointment';
import Head from './components/Head';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
 // ✅ use the renamed Contact.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './pages/Contact';

const App = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-[#0E0F24] dark:text-white">
      <ToastContainer />
      <Head />
      <div className="px-4 sm:px-[10%]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-profile" element={<Myprofile />} />
          <Route path="/my-appointments" element={<Myappointments />} />
         
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path ="/Contact" element={<Contact />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
