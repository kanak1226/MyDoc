import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, specialityData, doctors } from '../assets/assets'; // Assuming you have doctor and specialty data

const SearchByFilter = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  // Handle Search
  const handleSearch = () => {
    const results = doctors.filter(doctor => {
      const locationMatches = doctor.address.line1.toLowerCase().includes(location.toLowerCase()) || doctor.address.line2.toLowerCase().includes(location.toLowerCase());
      const specialtyMatches = doctor.speciality.toLowerCase().includes(specialty.toLowerCase());
      return locationMatches && specialtyMatches;
    });

    setFilteredDoctors(results);
  };

  // Handle Doctor Click to Navigate to Appointment Page
  const handleDoctorClick = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
  };

  return (
    <div className="search-by-filter flex flex-col items-center">
      <div className="search-form mb-4 flex gap-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location"
          className="search-input border rounded-md px-4 py-2"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="search-select border rounded-md px-4 py-2"
        >
          <option value="">Select Specialty</option>
          {specialityData.map((speciality) => (
            <option key={speciality.speciality} value={speciality.speciality}>
              {speciality.speciality}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} className="search-button bg-indigo-500 text-white rounded-md px-4 py-2">
          Search
        </button>
      </div>

      <div className="doctors-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="doctor-card cursor-pointer border p-4 rounded-md"
              onClick={() => handleDoctorClick(doctor._id)}
            >
              <img src={doctor.image} alt={doctor.name} className="doctor-image rounded-full w-16 h-16 mb-4" />
              <div className="doctor-info">
                <p className="doctor-name font-bold">{doctor.name}</p>
                <p className="doctor-specialty text-sm">{doctor.speciality}</p>
                <p className="doctor-location text-xs text-gray-500">
                  {doctor.address.line1}, {doctor.address.line2}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchByFilter;
