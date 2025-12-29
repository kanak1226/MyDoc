import React from 'react';

const PatientProfile = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg text-gray-800 dark:text-white max-w-xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Patient Profile</h2>
      <img src={data.image} alt="profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Phone:</strong> {data.phone}</p>
      <p><strong>Gender:</strong> {data.gender}</p>
      <p><strong>Date of Birth:</strong> {data.dob}</p>
      <p><strong>Address:</strong> {data.address?.line1}, {data.address?.line2}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Documents</h3>
        {data.documents?.map((doc, i) => (
          <div key={i} className="mt-2">
            <p>{doc.type}</p>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              View Document
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientProfile;
