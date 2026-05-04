import axios from 'axios';

// Dynamically determine the backend URL based on the current hostname
// This ensures it works both on localhost and over the local network (192.168.x.x)
const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : `http://${window.location.hostname}:3000/api`;

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default API;
