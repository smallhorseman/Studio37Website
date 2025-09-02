import { createContext, useContext, useState, useMemo } from 'react';
import apiClient from './api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  const login = async (username, password) => {
    try {
      // Use the correct auth service URL and endpoint
      const response = await apiClient.post('https://auth-3778.onrender.com/login', {
        username,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('jwt_token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed: Invalid credentials or server error.' };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};