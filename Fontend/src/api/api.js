import axios from 'axios';

// Access the backend URL from environment variables
const baseurl = import.meta.env.VITE_BACKEND_API_USER || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: baseurl,
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle auth
api.interceptors.request.use(
  (config) => {
    // Get the token from cookies if it exists
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
