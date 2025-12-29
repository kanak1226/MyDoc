import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets'; // Import the assets
import {useNavigate} from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-4 border-b bg-white shadow-md">
      <div className="flex items-center gap-4">
        {/* Larger logo for visibility */}
        <img src={assets.my_Doc} alt="Doctor" className="w-20 h-20 rounded-full shadow-lg" />
        
        <div className="flex flex-col">
          {/* Tailwind text with hover effect */}
          <p className="text-4xl font-bold text-gray-800 transition-transform duration-300 hover:scale-110">
            My <span className="text-yellow-400">Doc</span>
          </p>
          <span className="text-sm text-gray-500">Dashboard Panel</span>
        </div>

        <div className="ml-4 px-4 py-1 border rounded-full text-sm bg-gray-100 text-gray-600 shadow-sm">
          {aToken ? 'Admin' :  'Doctor'}
        </div>
      </div>
      
      <button onClick={logout} className="px-6 py-2 bg-purple-600 text-white font-medium rounded-full shadow-md hover:bg-purple-700 transition">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
