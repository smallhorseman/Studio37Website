import axios from 'axios';
import { API_BASE } from '@/config/env';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or get from context/hook
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401/404 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Optional: broadcast logout
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      if (error.response.status === 404) {
        // Optionally handle not found
        // e.g., show a toast or redirect
      }
    }
    return Promise.reject(error);
  }
);

// Example usage:
// apiClient.get('/services') will request https://sem37-api.onrender.com/api/services
// apiClient.get('/packages') will request https://sem37-api.onrender.com/api/packages

export default apiClient;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export { api };