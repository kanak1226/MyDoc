import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent'>
        What Would You Like To Find?
      </h1>
      <p className='sm:w-1/3 text-center text-sm bg-gradient-to-r from-blue-200 to-blue-500 bg-clip-text text-transparent'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-auto px-4'>
        {specialityData.map((item, index) => (
          <div key={index} className='relative group flex flex-col items-center'>
            <Link
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className='min-w-[140px] sm:min-w-[160px] p-4 flex flex-col items-center gap-3 text-xs cursor-pointer flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg rounded-2xl hover:-translate-y-2 transition-transform duration-300'
            >
              <img className='w-16 sm:w-24 mb-1' src={item.image} alt={item.speciality} />
              <div className='px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900'>
                <p className='bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-semibold text-base text-center'>
                  {item.speciality}
                </p>
              </div>
            </Link>

            {/* Full Info Box on Hover */}
            <div className='absolute top-full mt-4 left-1/2 transform -translate-x-1/2 z-10 w-72 p-4 text-sm text-gray-100 bg-blue-700 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none'>
              <h3 className='text-lg font-semibold mb-2'>Did you know?</h3>
              <p className='text-sm leading-relaxed'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
