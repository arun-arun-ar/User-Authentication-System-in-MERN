import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import api from '../../api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null); // Store user image URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadStatus('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus('File size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      setUploadStatus('Uploading...');

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (response.data.success) {
        // Construct the full image URL
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        const fullImageUrl = `${baseUrl}/public${response.data.image.path}`;
        setUserImage(fullImageUrl);
        setUploadStatus('Image uploaded successfully!');

        // Clear the success message after 10 seconds
        setTimeout(() => {
          setUploadStatus('');
        }, 10000);
      }
    } catch (err) {
      setUploadStatus(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const response = await api.get('/users/get-current-user', { withCredentials: true });

        if (response.data.success) {
          setUser(response.data.user);

          // Fetch user image using the correct endpoint
          const imageResponse = await api.get('/images/user-images', {
            withCredentials: true,
          });

          if (imageResponse.data.success && imageResponse.data.image.length > 0) {
            // Get the first image from the array and construct the full URL
            const imagePath = imageResponse.data.image[0].path;
            console.log('Image Path:', imagePath);
            // Remove /api from the base URL since the public directory is served at the root
            const baseUrl = api.defaults.baseURL.replace('/api', '');
            const fullImageUrl = `${baseUrl}/public${imagePath}`;
            console.log('Full Image URL:', fullImageUrl);
            setUserImage(fullImageUrl);
          } else {
            console.log('No images found or request unsuccessful');
          }
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
                <div className="space-y-3 p-2">
                  <p>
                    <span className="text-gray-400">Full Name:</span> {user?.fullname || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span> {user?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <Link
                    to="/change-user-password"
                    className="mt-8 md:mt-0 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors duration-200 p-4"
                  >
                    Change Passwrod
                  </Link>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="bg-gray-700 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-cyan-300">Profile Picture</h2>
                <div className="flex flex-col items-center space-y-4">
                  {userImage ? (
                    <>
                      <img
                        src={userImage}
                        alt="Profile"
                        className="w-40 h-40 rounded-xl object-cover"
                      />
                      <p className="text-sm text-gray-400">Profile picture uploaded successfully</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400">No profile image available</p>
                      {/* Image Upload Form - Only show when no image exists */}
                      <div className="w-full max-w-xs">
                        <label className="block mb-2">
                          <span className="sr-only">Choose profile photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="block w-full text-sm text-gray-400
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-cyan-600 file:text-white
                              hover:file:bg-cyan-700
                              file:cursor-pointer
                              disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </label>
                        {uploadStatus && (
                          <p className={`mt-2 text-sm ${uploadStatus.includes('success')
                              ? 'text-green-400'
                              : uploadStatus === 'Uploading...'
                                ? 'text-cyan-400'
                                : 'text-red-400'
                            }`}>
                            {uploadStatus}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
