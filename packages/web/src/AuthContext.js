import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AUTH_API_URL = 'https://auth-3778.onrender.com';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = = useState(localStorage.getItem('jwt_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null);
  };

  const value = { token, login, logout };

  // THE FIX: This 'return' statement is CRITICAL
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