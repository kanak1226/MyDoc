import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/adm.jpg';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint = state === 'Admin' ? '/api/admin/login' : '/api/doctor/login';
      const { data } = await axios.post(`${backendUrl}${endpoint}`, { email, password });

      if (data.success) {
        const tokenKey = state === 'Admin' ? 'aToken' : 'dToken';
        const setTokenFn = state === 'Admin' ? setAToken : setDToken;

        setTokenFn(data.token);
        localStorage.setItem(tokenKey, data.token);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const token = state === 'Admin' ? localStorage.getItem('aToken') : localStorage.getItem('dToken');
    if (token) navigate('/');
  }, [state, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col md:flex-row gap-10 items-center p-6 sm:p-10 rounded-xl shadow-lg backdrop-blur-md bg-white/10 dark:bg-gray-800/20 transition-all duration-300">

        {/* Login Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 w-full sm:min-w-[340px] md:min-w-[380px] text-sm text-gray-700 dark:text-gray-100">
          <p className="text-2xl font-semibold text-center">{state} Login</p>
          <p className="mb-2 text-center">Please login to continue</p>

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700 text-black dark:text-white rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700 text-black dark:text-white rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>

          <button className="bg-[#5F6FFF] text-white w-full py-2 my-2 rounded-md text-base hover:bg-[#4c56ff] transition">
            Login
          </button>

          <p className="text-center">
            {state === 'Admin' ? (
              <>
                Doctor Login?{' '}
                <span onClick={() => setState('Doctor')} className="text-[#5F6FFF] underline cursor-pointer">
                  Click here
                </span>
              </>
            ) : (
              <>
                Admin Login?{' '}
                <span onClick={() => setState('Admin')} className="text-[#5F6FFF] underline cursor-pointer">
                  Click here
                </span>
              </>
            )}
          </p>
        </form>

        {/* Right Side: Shared Video Animation */}
        <div className="hidden md:block w-[500px] h-[500px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain rounded-xl shadow-md"
          >
            <source
              src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/online-doctor-appointment-animation-download-in-lottie-json-gif-static-svg-file-formats--consultation-hospital-medical-pack-healthcare-animations-7070384.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default Login;
