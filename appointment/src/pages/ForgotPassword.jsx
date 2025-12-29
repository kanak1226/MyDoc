// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgImage from '../assets/yee.jpg';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:4001/api/user/forgot-password', { email });
      toast.success(res.data.message);
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/10 dark:bg-gray-800/30 p-6 sm:p-10 rounded-lg shadow-md backdrop-blur-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <p className="mb-6 text-sm text-gray-200">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-white/20 border border-gray-400 text-white placeholder-gray-300 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#5F6FFF] hover:bg-[#4c56ff] transition text-white font-semibold py-2 rounded"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p
          className="mt-4 text-sm underline cursor-pointer text-blue-300"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
