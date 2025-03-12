import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/api';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const response = await api.post('/users/register', formData);
      window.alert(response.data.message || "User created successfully!");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "User Registration Failed. Try Again!!");
    }
  };

  return (
    <div className='bg-violet-500 min-h-screen flex items-center justify-center p-5'>
      <div className='flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-md shadow-md overflow-hidden'>
        <div className='md:w-2/5 flex items-center justify-center p-10 bg-violet-500'>
          <h1 className='text-2xl md:text-4xl text-white text-center font-bold sigmar-regular '>
            Don't have an Account? Create one for Free!
          </h1>
        </div>
        <div className='md:w-3/5 p-6'>
          <h1 className='text-center text-2xl md:text-3xl font-bold text-violet-500 mb-6'>
            Registration Form
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col mb-4'>
              <label className='text-lg font-semibold'>Full Name</label>
              <input
                type='text'
                {...register("fullname", { required: "Full Name is Required" })}
                placeholder='Enter Your Full Name'
                className='h-10 border rounded-md pl-4'
              />
              {errors.fullname && <p className='text-red-500 text-sm'>{errors.fullname.message}</p>}
            </div>

            <div className='flex flex-col mb-4'>
              <label className='text-lg font-semibold'>Email</label>
              <input
                type='email'
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder='Enter your email'
                className='h-10 border rounded-md pl-4'
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>

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
                className='h-10 border rounded-md pl-4 pr-10'
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-10 cursor-pointer'
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>

            <div className='relative flex flex-col mb-4'>
              <label className='text-lg font-semibold'>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === getValues("password") || "Passwords do not match",
                })}
                placeholder='Confirm your password'
                className='h-10 border rounded-md pl-4 pr-10'
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-10 cursor-pointer'
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </span>
              {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
            </div>


            <div className='flex justify-center mt-5'>
              <button
                type='submit'
                className='bg-violet-500 text-white px-6 py-2 rounded-md w-full font-bold hover:bg-violet-700'
              >
                Register
              </button>
            </div>

            {/* Error message display */}
            {message && <div className='mt-4 text-center text-lg text-red-500'>{message}</div>}
          </form>

          <p className='mt-6 text-center text-sm md:text-lg font-semibold'>
            By registering, you agree to our Terms and Conditions and Privacy Policy.
          </p>
          <p className='text-center mt-4 text-sm md:text-lg font-semibold'>
            Already have an account?
            <Link to='/login' className='ml-2 font-bold text-violet-500'>Click here to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;