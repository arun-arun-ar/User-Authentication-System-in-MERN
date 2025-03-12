import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex flex-col md:flex-row items-center justify-center md:justify-between h-screen max-w-6xl mx-auto px-4'>
        {/* Left Content */}
        <div className='md:w-1/2 mb-10 md:mb-0 text-center md:text-left'>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-800 mb-6'>
            Welcome to User Authentication System
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Secure and reliable user authentication for your applications
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
            <Link
              to="/register"
              className='bg-green-500 py-3 px-8 rounded-lg text-white font-semibold hover:bg-green-600 transition duration-300 text-center'
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className='border-2 border-gray-300 py-3 px-8 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-300 text-center'
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className='md:w-1/2 flex justify-center'>
          <div className='w-full max-w-md'>
           <img src="https://img.freepik.com/free-vector/personal-settings-concept-illustration_114360-2858.jpg?uid=R88770947&ga=GA1.1.1506247137.1739685674&semt=ais_hybrid" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home