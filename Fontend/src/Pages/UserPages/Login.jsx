import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/api';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const response = await api.post('/users/login', formData); 
      setMessage(response.data.message);
      console.log(api)

      if (response.data.success) {
        navigate('/user-dashboard');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "User Login Failed!!";
      setMessage(errorMessage);
    }
  };

  return (
    <div className='bg-violet-300 min-h-screen flex items-center justify-center'>
      <div className='w-full sm:w-1/2 mx-auto py-10'>
        <div className='bg-white rounded-md shadow-lg p-8'>
          <h1 className='text-center sigmar-regular text-3xl font-semibold text-violet-500 mb-6'>
            USER LOGIN
          </h1>
          <p className='text-center mb-6 text-gray-600'>
            Welcome back! Please enter your credentials to log in.
          </p>

          {message && <div className="bg-red-100 text-red-600 p-3 text-center rounded mb-4">{message}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-[80%] mx-auto">
            <div className='flex flex-col mb-4'>
              <label className='text-lg font-semibold'>Email</label>
              <input
                type='email'
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder='Enter your email'
                className='h-10 border rounded-md pl-4 focus:outline-none focus:ring-2 focus:ring-violet-400'
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className='relative flex flex-col mb-4'>
              <label className='text-lg font-semibold'>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain at least one letter and one number",
                  },
                })}
                placeholder='Enter your password'
                className='h-10 border rounded-md pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-400'
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-600'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <div className='mb-4'>
              <button
                type='submit'
                className='bg-violet-500 text-white px-6 py-2 rounded-md w-full font-bold hover:bg-violet-700 transition duration-300'
              >
                Login
              </button>
            </div>
          </form>

          {/* Forgot Password */}
          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Forgot Password?
              <Link to='/reset-password' className='ml-1 font-bold text-violet-500 hover:underline'>
                Reset Here
              </Link>
            </p>
          </div>

          {/* Registration */}
          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Don't have an account?
              <Link to='/register' className='ml-1 font-bold text-violet-500 hover:underline'>
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
