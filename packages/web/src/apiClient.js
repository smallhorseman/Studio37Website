import axios from 'axios';

// Determine the base URL based on the environment.
// This prevents the 'localhost' vs 'onrender' problem.
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://sem37-api.onrender.com/api'
  : 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// THIS IS THE MAGIC!
// This interceptor function runs before every single request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // It grabs the token from localStorage...
    const token = localStorage.getItem('token'); // The key matches your AuthContext!
    
    // ...and if the token exists, it adds it to the request headers.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // It then sends the modified request on its way.
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
