import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const AUTH_API_URL = 'https://auth-3778.onrender.com';

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('jwt_token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
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