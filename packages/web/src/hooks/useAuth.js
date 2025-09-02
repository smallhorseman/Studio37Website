import React, { createContext, useContext, useState, useEffect } from 'react';

// Lean stub auth
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const value = {
    token: null,
    isAuthenticated: false,
    isReady: ready,
    loading: !ready,
    login: async () => false,
    logout: () => {},
    getAuthHeader: () => ({})
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  return useContext(AuthContext) || {
    token: null,
    isAuthenticated: false,
    isReady: true,
    loading: false,
    login: async () => false,
    logout: () => {},
    getAuthHeader: () => ({})
  };
}
