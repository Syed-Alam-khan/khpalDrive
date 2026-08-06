// Deployment Trigger - V4.1
import axios from 'axios';

// Dynamically determine the backend URL based on the current hostname
const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api' 
  : 'https://khpal-drive-backend.vercel.app/';

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

console.log("API Base URL:", baseURL);

// Add a request interceptor to attach the token to every request
API.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        // The token could be in parsedInfo.token or parsedInfo.data.token depending on response structure
        const token = parsedInfo.token || parsedInfo.data?.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("No token found in userInfo", parsedInfo);
        }
      }
    } catch (error) {
      console.error("Error reading token from localStorage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
