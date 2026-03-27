// Central API configuration
// Uses environment variable VITE_API_URL for production (set in Vercel)
// Falls back to localhost for development

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiConfig = {
  baseURL: API_URL,
  API_URL: API_URL,
};

export default apiConfig;
