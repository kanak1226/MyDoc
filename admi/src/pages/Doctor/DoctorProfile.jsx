import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import bgImage from '../../assets/edit.jpg';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='w-full max-w-4xl bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl'>
        <div className='flex flex-col sm:flex-row gap-6 text-sm text-gray-800 dark:text-gray-200'>

          {/* Doctor Image */}
          <div>
            <img className='bg-primary/80 w-48 h-48 rounded-xl object-cover border-4 border-white shadow-md' src={profileData.image} alt="Doctor" />
          </div>

          {/* Profile Info */}
          <div className='flex-1'>
            <p className='text-2xl font-semibold text-gray-800 dark:text-white'>{profileData.name}</p>
            <div className='flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300'>
              <p>{profileData.degree} - {profileData.speciality}</p>
              <span className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</span>
            </div>

            {/* About */}
            <div className='mt-5'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>About:</p>
              {
                isEdit
                  ? <textarea
                      onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                      className='w-full outline-none bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-100 p-2 mt-1 rounded border'
                      rows={5}
                      value={profileData.about}
                    />
                  : <p className='text-gray-700 dark:text-gray-300 mt-1'>{profileData.about}</p>
              }
            </div>

            {/* Fees */}
            <div className='mt-4'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Appointment Fee:</span>
              <span className='ml-2'>
                {
                  isEdit
                    ? <input
                        type='number'
                        className='bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded border ml-1'
                        onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                        value={profileData.fees}
                      />
                    : <span className='text-gray-800 dark:text-gray-200'>{currency} {profileData.fees}</span>
                }
              </span>
            </div>

            {/* Address */}
            <div className='mt-4'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Address:</p>
              {
                isEdit
                  ? <div className='flex flex-col gap-2 mt-1'>
                      <input
                        type='text'
                        className='bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded border'
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                        value={profileData.address.line1}
                      />
                      <input
                        type='text'
                        className='bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded border'
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                        value={profileData.address.line2}
                      />
                    </div>
                  : <p className='text-gray-700 dark:text-gray-300 mt-1'>
                      {profileData.address.line1}<br />{profileData.address.line2}
                    </p>
              }
            </div>

            {/* Availability */}
            <div className='flex items-center gap-2 mt-4'>
              <input
                type="checkbox"
                id="availability"
                onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                checked={profileData.available}
                className='accent-blue-500'
              />
              <label htmlFor="availability" className='text-sm text-gray-700 dark:text-gray-300'>Available</label>
            </div>

            {/* Buttons */}
            <div className='mt-8 flex justify-start'>
              {
                isEdit ? (
                  <button
                    onClick={updateProfile}
                    className='px-6 py-2 rounded-full border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-sm'
                  >
                    💾 Save Information
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className='px-6 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm'
                  >
                    ✏️ Edit
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
