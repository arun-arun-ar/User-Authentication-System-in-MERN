import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import api from '../../api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null); // Store user image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/get-current-user', { withCredentials: true });

        if (response.data.success) {
          setUser(response.data.user);
          setUserImage(response.data.user.imageUrl); // Assuming the user object contains imageUrl
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        <div className="bg-red-100 p-4 rounded-lg text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto my-16">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                  {user?.fullname}
                </h1>
                <p className="text-gray-400 mt-2">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to="/user-profile/edit" // Corrected route path
                className="mt-4 md:mt-0 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors duration-200"
              >
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="bg-gray-700 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-cyan-300">Personal Information</h2>
                <div className="space-y-3">
                  <p>
                    <span className="text-gray-400">Full Name:</span> {user?.fullname || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span> {user?.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="bg-gray-700 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-cyan-300">Profile Picture</h2>
                <div className="flex flex-col items-center">
                  <img
                    src="#"
                    alt=""
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
