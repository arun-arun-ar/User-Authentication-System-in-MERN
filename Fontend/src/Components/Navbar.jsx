import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaInfoCircle, FaEnvelope, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import api from '../api/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/user-dashboard", text: "Dashboard", icon: <FaHome /> },
    { to: "/user-profile", text: "Profile", icon: <FaUser /> },
    { to: "/about", text: "About", icon: <FaInfoCircle /> },
    { to: "/contact", text: "Contact", icon: <FaEnvelope /> },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/users/logout', {}, { withCredentials: true });

      localStorage.removeItem('userToken');

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-slate-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">Logo</span>
            </Link>
            <div className="hidden md:flex md:ml-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="ml-4 px-3 py-2 rounded-md flex items-center text-sm font-medium text-white hover:bg-slate-700 transition-colors duration-200"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700"
              >
                <div className="flex items-center">
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </div>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <div className="flex items-center">
                <FaSignOutAlt className="mr-2" />
                Logout
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;