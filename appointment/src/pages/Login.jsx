import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import bgImage from '../assets/yee.jpg'; // Background image

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken, setUserData } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (state === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
      }

      const { data } = response;
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setToken(data.token);
        setUserData(data.user);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    const decoded = jwtDecode(credential);

    try {
      const res = await axios.post(`${backendUrl}/api/auth/google-login`, {
        token: credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUserData(res.data.user);
      toast.success('Logged in with Google!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Google login failed');
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center transition-colors duration-300"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col md:flex-row gap-10 items-center p-6 sm:p-10 rounded-xl shadow-lg backdrop-blur-md bg-white/5 dark:bg-gray-800/10 transition-all duration-300">

        {/* Form Section */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-3 w-full sm:min-w-[340px] md:min-w-[380px] text-sm text-gray-700 dark:text-gray-100"
        >
          <p className="text-2xl font-semibold">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </p>
          <p className="mb-2">
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment
          </p>

          {state === 'Sign Up' && (
            <div className="w-full">
              <p>Full Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/60 text-black dark:text-white rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/60 text-black dark:text-white rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/60 text-black dark:text-white rounded w-full p-2 mt-1"
              type="password"
              required
            />
            {state === 'Login' && (
              <p className="text-right text-sm mt-1">
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </span>
              </p>
            )}
          </div>

          <button className="bg-[#5F6FFF] text-white w-full py-2 my-2 rounded-md text-base hover:bg-[#4c56ff] transition">
            {state === 'Sign Up' ? 'Create account' : 'Login'}
          </button>

          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-[#5F6FFF] underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create a new account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-[#5F6FFF] underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}

          {/* 👇 Google Login button */}
          <div className="flex justify-center my-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed')}
              width="100%"
            />
          </div>
        </form>

        {/* Right Side Animation */}
        <div className="w-[500px] h-[500px] hidden md:block">
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
