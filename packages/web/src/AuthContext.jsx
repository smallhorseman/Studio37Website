import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('jwt_token'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hydration complete (optimistic if token exists)
    setIsReady(true);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Try remote first, fall back to proxy/relative
      const endpoints = [
        'https://auth-3778.onrender.com/login',
        '/api/auth/login',
        '/auth/login'
      ];
      let got = null;
      for (const u of endpoints) {
        try {
          const res = await fetch(u, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
          });
          if (!res.ok) continue;
          const ct = (res.headers.get('content-type') || '').toLowerCase();
          if (!ct.includes('json')) continue;
          const json = await res.json();
          got = json.token || json.access_token || json.jwt || null;
          if (got) break;
        } catch { continue; }
      }
      if (!got) {
        if (import.meta.env.DEV) {
          got = `dev-${Date.now()}`; // dev fallback
        } else {
          throw new Error('Login failed');
        }
      }
      localStorage.setItem('jwt_token', got);
      setToken(got);
      return { success: true };
    } catch (e) {
      setAuthError(e.message || 'Login failed');
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem('jwt_token'); } catch { /* ignore */ }
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    token,
    isAuthenticated: !!token,
    isReady,
    loading,
    authError,
    login,
    logout
  }), [token, isReady, loading, authError, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};