import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sem37-api.onrender.com/api',
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
        // Redirect to login or show unauthorized message
        window.location.href = '/login';
      }
      if (error.response.status === 404) {
        // Optionally handle not found
        // e.g., show a toast or redirect
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;