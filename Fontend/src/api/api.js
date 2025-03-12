import axios from 'axios';

// Access the backend URL from environment variables
const baseurl = import.meta.env.VITE_BACKEND_API_USER || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: baseurl,
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' }
});

export default api;
