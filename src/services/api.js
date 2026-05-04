import axios from 'axios';

// Dynamically determine the backend URL based on the current hostname
// This ensures it works both on localhost and over the local network (192.168.x.x)
const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api' 
  : 'https://khpaldrivebackend-production.up.railway.app/api';

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Add a request interceptor to attach the token to every request
API.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
