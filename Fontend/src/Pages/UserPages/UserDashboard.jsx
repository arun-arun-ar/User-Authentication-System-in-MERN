import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom";
import api from '../../api/api';


const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/get-current-user', { withCredentials: true }); 


        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-xl">
        <div className="bg-red-100 p-4 rounded-lg shadow-lg text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {user?.fullname}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Manage your account details and preferences
          </p>

          <Link
            to="/user-profile"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-200"
          >
            View Profile
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;