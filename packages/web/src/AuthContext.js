// packages/web/src/AuthContext.js
import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      login: (username, password) => {
        // Implement your login logic here
        if (username === 'admin' && password === 'password') {
          setUser({ username: 'admin' });
          return true;
        }
        return false;
      },
      logout: () => {
        setUser(null);
      },
      isAuthenticated: () => {
        return !!user;
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};