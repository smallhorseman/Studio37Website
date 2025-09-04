import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

const AUTH_BASE = import.meta.env.VITE_AUTH_URL || 'https://auth-3778.onrender.com';

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

  // NEW: cross-tab + internal unauthorized sync
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'jwt_token') {
        setToken(e.newValue);
      }
    }
    function onUnauthorized() {
      try { localStorage.removeItem('jwt_token'); } catch {}
      setToken(null);
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, []);

  // Optional manual token refresh stub (if backend adds refresh later)
  const refreshToken = useCallback(async () => {
    // placeholder: implement /refresh when API available
    return token;
  }, [token]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const endpoints = [
        '/auth/login', // Proxy first
        `${AUTH_BASE.replace(/\/+$/, '')}/login`
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
    logout,
    refreshToken // NEW
  }), [token, isReady, loading, authError, login, logout, refreshToken]);

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