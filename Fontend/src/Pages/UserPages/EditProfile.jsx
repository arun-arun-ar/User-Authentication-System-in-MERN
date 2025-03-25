import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const EditProfile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user details
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/get-current-user', { withCredentials: true });
        if (response.data.success) {
          setFullname(response.data.user.fullname);
          setEmail(response.data.user.email);
        }
      } catch (err) {
        setMessage('Error fetching user details');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/upadate-user-details', 
        { fullname, email }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage('Profile updated successfully!');
        setTimeout(() => navigate('/user-profile'), 2000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className='w-full bg-gray-900 h-screen text-white flex items-center justify-center'>
      <div className='max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-semibold text-center mb-4'>Edit Profile</h1>
        {message && <p className='text-center text-green-400 mb-2'>{message}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-400'>Full Name</label>
            <input 
              type='text' 
              value={fullname} 
              onChange={(e) => setFullname(e.target.value)} 
              className='w-full p-2 rounded bg-gray-700 text-white' 
              required 
            />
          </div>
          <div>
            <label className='block text-gray-400'>Email</label>
            <input 
              type='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className='w-full p-2 rounded bg-gray-700 text-white' 
              required 
            />
          </div>
          <button type='submit' className='w-full p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg'>
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
