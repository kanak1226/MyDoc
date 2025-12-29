import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import md5 from 'md5';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);

  const [showLogoPopup, setShowLogoPopup] = useState(false);

  const getGravatarUrl = (email) => {
    const hash = email ? md5(email.trim().toLowerCase()) : '';
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken) setToken(storedToken);
    if (storedUserData) setUserData(JSON.parse(storedUserData));
  }, [setToken, setUserData]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUserData(null);
    navigate('/login');
  };

  return (
    <>
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD] dark:border-gray-700 px-4'>
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLogoPopup(true)}>
          <img
            className='w-12 h-12 rounded-full object-cover'
            src={assets.my_Doc}
            alt="my_Doc"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            MY DOC
          </span>
        </div>

        {/* Navigation Links */}
        <ul className='md:flex items-start gap-5 font-medium hidden text-gray-700 dark:text-gray-300'>
          <NavLink to='/'>HOME</NavLink>
          <NavLink to='/doctors'>ALL DOCTORS</NavLink>
          <NavLink to='/about'>ABOUT</NavLink>
          <NavLink to='/contact'>CONTACT</NavLink>
        </ul>

        {/* Right section */}
        <div className='flex items-center gap-4'>
          <ThemeToggle />

          {token && userData ? (
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img
                className='w-10 h-10 rounded-full'
                src={userData.image || getGravatarUrl(userData.email)}
                alt="User"
              />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-300 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 dark:bg-gray-800 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black dark:hover:text-white cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='bg-[#5F6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block'
            >
              Create account
            </button>
          )}
        </div>
      </div>

      {/* Logo Popup Modal */}
      {showLogoPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-600 dark:text-gray-300"
              onClick={() => setShowLogoPopup(false)}
            >
              &times;
            </button>
            <img src={assets.my_Doc} alt="Full Logo" className="w-full object-contain max-h-60 p-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Welcome!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 px-6">Book your appointment with ease and convenience</p>
            <img
              src="https://img.freepik.com/premium-photo/stethoscope-with-calendar-page-date-blue-background-doctor-appointment-medical-concept_293060-176.jpg"
              alt="Appointment"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
