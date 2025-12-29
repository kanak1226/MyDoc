import React from 'react';

const Contact = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('https://www.shutterstock.com/image-photo/doctor-contact-us-customer-support-260nw-662058769.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-4xl p-10 rounded-2xl shadow-xl opacity-90 bg-transparent text-center mt-12">
        <h2 className="text-3xl font-bold mb-6" style={{ color: 'black' }}>
          Contact <span className="text-blue-500">Us</span>
        </h2>

        <div className="mb-8 text-lg" style={{ color: 'black' }}>
          <p>Email: <a href="mailto:mydoc@gmail.com" className="text-blue-400">mydoc@gmail.com</a></p>
          <p>Phone: <a href="tel:789479xxxx" className="text-blue-400">789479xxxx</a></p>
        </div>

        <div className="text-lg" style={{ color: 'black' }}>
          <p>If you have any questions, feel free to reach out to us via email or phone.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
