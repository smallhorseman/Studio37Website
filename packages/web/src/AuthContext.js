import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage so it persists across reloads
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  useEffect(() => {
    // This effect syncs the state with localStorage
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      // Use the environment variable for the endpoint
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken); // This will trigger the useEffect to save to localStorage
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null); // This will trigger the useEffect to remove from localStorage
  };

  const value = { token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
