import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();
      formData.append('profileImage', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: {
          Authorization: `Bearer ${aToken}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='w-full flex justify-center items-center min-h-screen p-6'>
      <div className='w-full max-w-5xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl p-10 shadow-xl overflow-y-auto max-h-[90vh]'>
        <p className='mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white'>➕ Add Doctor</p>

        <div className='flex items-center gap-4 mb-8 text-gray-800 dark:text-gray-200'>
          <label htmlFor="doc-img">
            <img className='w-20 h-20 bg-gray-200 rounded-full cursor-pointer object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-700 dark:text-gray-200'>

          {/* Column 1 */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <p>Your name *</p>
              <input required onChange={e => setName(e.target.value)} value={name} className='border-2 border-black rounded px-3 py-2' type="text" placeholder='Name' />
            </div>

            <div className='flex flex-col gap-1'>
              <p>Doctor Email *</p>
              <input required onChange={e => setEmail(e.target.value)} value={email} className='border-2 border-black rounded px-3 py-2' type="email" placeholder='Email' />
            </div>

            <div className='flex flex-col gap-1'>
              <p>Set Password *</p>
              <input required onChange={e => setPassword(e.target.value)} value={password} className='border-2 border-black rounded px-3 py-2' type="password" placeholder='Password' />
            </div>

            <div className='flex flex-col gap-1'>
              <p>Experience *</p>
              <select onChange={e => setExperience(e.target.value)} value={experience} className='border-2 border-black rounded px-2 py-2'>
                {['1 Year', '2 Year', '3 Year', '4 Year', '5 Year', '6 Year', '8 Year', '9 Year', '10 Year'].map((exp, i) => (
                  <option key={i} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <p>Fees *</p>
              <input required onChange={e => setFees(e.target.value)} value={fees} className='border-2 border-black rounded px-3 py-2' type="number" placeholder='Doctor fees' />
            </div>
          </div>

          {/* Column 2 */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <p>Speciality *</p>
              <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border-2 border-black rounded px-2 py-2'>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <p>Degree *</p>
              <input required onChange={e => setDegree(e.target.value)} value={degree} className='border-2 border-black rounded px-3 py-2' type="text" placeholder='Degree' />
            </div>

            <div className='flex flex-col gap-1'>
              <p>Address *</p>
              <input required onChange={e => setAddress1(e.target.value)} value={address1} className='border-2 border-black rounded px-3 py-2' type="text" placeholder='Address 1' />
              <input required onChange={e => setAddress2(e.target.value)} value={address2} className='border-2 border-black rounded px-3 py-2' type="text" placeholder='Address 2' />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className='mt-6'>
          <p className='mb-1'>About Doctor</p>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border-2 border-black rounded' rows={4} placeholder='Write about the doctor...'></textarea>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center mt-8'>
          <button
            type='submit'
            className='bg-primary px-10 py-3 text-black rounded-full transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 shadow-md'
          >
            ➕ Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
