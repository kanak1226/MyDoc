import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-sky-500 rounded-lg px-6 md:px lg:px-20">
      {/*............... left side............*/}
      <div className="md:w-1/2 flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight mb-6">
          Book Appointment <br />
          With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light mb-6">
          <img className="w-28" src={assets.group_profiles} alt="Doctor Profiles" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" /> schedule your appointment
            hassle-free.
          </p>
        </div>
        {/* Updated Anchor Tag with Sky Blue to Dark Sky Gradient */}
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-sky-800 text-white px-6 py-2 rounded-full text-sm m-auto md:m-0 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-900 transition-all duration-300 outline outline-1 outline-transparent hover:outline-white max-w-xs"
        >
          Book Your Appointment <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/*..............right side.............*/}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Header Image"
        />
      </div>
    </div>
  );
};

export default Header;
