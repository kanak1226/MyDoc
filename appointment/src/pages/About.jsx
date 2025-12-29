import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="px-4 sm:px-10 lg:px-20 text-gray-700 dark:text-gray-300 transition-all duration-300">
      {/* Header */}
      <div className="text-center text-2xl pt-10">
        <p>
          ABOUT <span className="text-gray-900 dark:text-white font-semibold">US</span>
        </p>
      </div>

      {/* About Content */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px] rounded-lg shadow-md" src={assets.about_image} alt="about" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm">
          <p>
            Welcome to <strong>MY DOC</strong>, your trusted partner in managing your healthcare needs conveniently and efficiently.
            At MY DOC, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing
            their health records.
          </p>
          <p>
            MY DOC is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating
            the latest advancements to improve user experience and deliver superior service. Whether you're booking your first
            appointment or managing ongoing care, MY DOC is here to support you every step of the way.
          </p>
          <b className="text-gray-900 dark:text-white text-base">Our Vision</b>
          <p>
            Our vision at MY DOC is to create a seamless healthcare experience for every user. We aim to bridge the gap between
            patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us Title */}
      <div className="text-xl my-6">
        <p>
          WHY <span className="text-gray-900 dark:text-white font-semibold">CHOOSE US</span>
        </p>
      </div>

      {/* Why Choose Us Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-20">
        <div className="border dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-900 hover:text-white rounded-lg">
          <b className="text-gray-900 dark:text-white">EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className="border dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-900 hover:text-white rounded-lg">
          <b className="text-gray-900 dark:text-white">CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className="border dark:border-gray-700 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-900 hover:text-white rounded-lg">
          <b className="text-gray-900 dark:text-white">PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
