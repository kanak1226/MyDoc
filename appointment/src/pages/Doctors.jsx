import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Find the right doctor for you
      </h2>
      <p className="text-sm mb-6 bg-gradient-to-r from-gray-600 via-gray-800 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-400 dark:to-white">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 sticky top-24 h-fit flex flex-col gap-4 text-sm text-gray-700 dark:text-gray-300">
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist',
          ].map((item) => (
            <p
              key={item}
              onClick={() =>
                speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all"
            >
              {item}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-2 transition-all duration-300"
              key={index}
            >
              <img
                className="bg-blue-50 w-full h-48 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Available</span>
                </div>
                <p className="text-gray-900 dark:text-white text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
