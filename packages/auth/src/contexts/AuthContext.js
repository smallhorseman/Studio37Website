import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Look for 'jwt_token' on initial load
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);

  const login = async (email, password) => {
    try {
      // NOTE: Make sure this login URL is correct for your setup.
      // It might be your Render URL, not localhost.
      const response = await axios.post('https://auth-3778.onrender.com/login', {
        email,
        password,
      });
      const { token } = response.data;
      setToken(token);
      // **THE FIX:** Save the token under the key 'jwt_token'
      localStorage.setItem('jwt_token', token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    // **THE FIX:** Remove the 'jwt_token' upon logout
    localStorage.removeItem('jwt_token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

