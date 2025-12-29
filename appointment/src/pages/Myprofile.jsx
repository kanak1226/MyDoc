import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [documents, setDocuments] = useState([]);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);
      documents.forEach(doc => formData.append('documents', doc));

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
        setDocuments([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm p-4">
      <div className='w-full max-w-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/40 dark:border-gray-700'>
        <div className='flex flex-col items-center text-sm text-gray-800 dark:text-gray-200'>
          <label htmlFor='image' className='relative cursor-pointer'>
            <img className='w-36 h-36 rounded-full object-cover opacity-90 border-4 border-white shadow-md' src={image ? URL.createObjectURL(image) : userData.image} alt='Profile' />
            {!image && isEdit && (
              <img className='w-8 absolute bottom-1 right-1' src={assets.upload_icon} alt='Upload Icon' />
            )}
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>

          {isEdit ? (
            <input className='text-2xl font-semibold text-center bg-transparent border-b border-gray-300 focus:outline-none mt-4' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
          ) : (
            <p className='text-2xl font-semibold mt-4'>{userData.name}</p>
          )}

          <hr className='w-full border-gray-300 my-6' />

          <p className='font-semibold text-left w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Contact Information
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-3 w-full mt-3'>
            <span className='font-medium'>Email:</span>
            <span className='text-blue-600 dark:text-blue-400'>{userData.email}</span>

            <span className='font-medium'>Phone:</span>
            {isEdit ? (
              <input className='bg-white/50 dark:bg-gray-800 px-2 py-1 rounded border focus:outline-none' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
            ) : (
              <span className='text-blue-600 dark:text-blue-400'>{userData.phone}</span>
            )}

            <span className='font-medium'>Address:</span>
            {isEdit ? (
              <div className='flex flex-col gap-2'>
                <input className='bg-white/50 dark:bg-gray-800 px-2 py-1 rounded border focus:outline-none' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address?.line1 || ''} />
                <input className='bg-white/50 dark:bg-gray-800 px-2 py-1 rounded border focus:outline-none' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address?.line2 || ''} />
              </div>
            ) : (
              <span className='text-gray-700 dark:text-gray-300'>{userData.address?.line1 || ''} <br /> {userData.address?.line2 || ''}</span>
            )}
          </div>

          <p className='font-semibold text-left w-full mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Basic Information
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-3 w-full mt-3'>
            <span className='font-medium'>Gender:</span>
            {isEdit ? (
              <select className='bg-white/50 dark:bg-gray-800 px-2 py-1 rounded border' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <span className='text-gray-700 dark:text-gray-300'>{userData.gender}</span>
            )}

            <span className='font-medium'>Birthday:</span>
            {isEdit ? (
              <input className='bg-white/50 dark:bg-gray-800 px-2 py-1 rounded border' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
            ) : (
              <span className='text-gray-700 dark:text-gray-300'>{userData.dob}</span>
            )}
          </div>

          <p className='font-semibold text-left w-full mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Upload Documents
          </p>
          <div className='w-full mt-3'>
            {isEdit ? (
              <>
                <input type='file' multiple onChange={(e) => setDocuments([...e.target.files])} />
                {documents.length > 0 && (
                  <ul className='mt-2 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm'>
                    {documents.map((doc, i) => (
                      <li key={i}>{doc.name}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              userData.documentUrls?.length > 0 ? (
                <ul className='list-disc list-inside text-blue-600 dark:text-blue-400 text-sm'>
                  {userData.documentUrls.map((url, i) => (
                    <li key={i}>
                      <a href={url} target='_blank' rel='noopener noreferrer'>Document {i + 1}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className='text-gray-500 dark:text-gray-400 italic'>No documents uploaded</span>
              )
            )}
          </div>

          {/* ✅ UPDATED BUTTONS HERE */}
          <div className='mt-10 flex justify-center gap-4'>
            {isEdit ? (
              <button
                onClick={updateUserProfileData}
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
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;
