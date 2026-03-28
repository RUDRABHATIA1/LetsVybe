// Central API configuration.
// Prefer VITE_API_URL when provided. Otherwise choose a sensible default
// based on build mode so deployed builds never fall back to localhost.
const DEFAULT_DEV_API_URL = 'http://localhost:4000';
const DEFAULT_PROD_API_URL = 'https://letsvybe.onrender.com';
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = envApiUrl || (import.meta.env.DEV ? DEFAULT_DEV_API_URL : DEFAULT_PROD_API_URL);

export const apiConfig = {
  baseURL: API_URL,
  API_URL: API_URL,
};

export default apiConfig;
