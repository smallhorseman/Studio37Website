import React, { createContext, useContext, useState, useEffect } from 'react';

// Lean stub auth: always unauthenticated until real service is reintroduced.
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const value = {
    token: null,
    isAuthenticated: false,
    isReady: ready,
    loading: !ready,
    authError: null,
    login: async () => false,
    logout: () => {},
    getAuthHeader: () => ({}),
    fetchWithAuth: async () => { throw new Error('Auth disabled in lean mode'); }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback if hook used without provider
    return {
      token: null,
      isAuthenticated: false,
      isReady: true,
      loading: false,
      authError: null,
      login: async () => false,
      logout: () => {},
      getAuthHeader: () => ({}),
      fetchWithAuth: async () => { throw new Error('No provider'); }
    };
  }
  return ctx;
}
