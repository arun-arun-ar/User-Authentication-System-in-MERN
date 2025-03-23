import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/users/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      setTimeout(() => navigate('/user-dashboard'), 2000);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className='w-full h-screen bg-black text-white'>
      <div className='max-w-screen-lg mx-auto p-4'>
        <h1 className='text-3xl text-center font-bold'>Change Password</h1>
        {message && <p className='text-center text-red-500'>{message}</p>}
        <form className='flex flex-col space-y-4 w-[60%] mx-auto mt-8' onSubmit={handleSubmit}>
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
            <div className='flex flex-col relative' key={index}>
              <label htmlFor={field} className='text-lg'>
                {field === 'oldPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
              </label>
              <input
                type={showPassword[field] ? 'text' : 'password'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className='p-2 rounded-md border border-gray-500 pr-10'
              />
              <button
                type='button'
                className='absolute right-3 top-10 text-gray-500'
                onClick={() => togglePasswordVisibility(field)}
              >
                {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          ))}
          <button type='submit' className='bg-blue-500 text-white p-2 rounded-md'>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
