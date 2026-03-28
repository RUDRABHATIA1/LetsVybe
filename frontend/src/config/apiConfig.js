import axios from 'axios';

// Central API configuration.
// Prefer VITE_API_URL when provided. Otherwise choose a sensible default
// based on build mode so deployed builds never fall back to localhost.
const DEFAULT_DEV_API_URL = 'http://localhost:4000';
const DEFAULT_PROD_API_URL = 'https://letsvybe.onrender.com';
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = envApiUrl || (import.meta.env.DEV ? DEFAULT_DEV_API_URL : DEFAULT_PROD_API_URL);

// Create axios instance with interceptor to automatically add authorization token
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor to include JWT token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiConfig = {
  baseURL: API_URL,
  API_URL: API_URL,
};

export { axiosInstance };
export default axiosInstance;
