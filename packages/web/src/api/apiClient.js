import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sem37-api.onrender.com/api',
});

// Add token to every request if available
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

export default apiClient;