import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const TOKEN_KEY = 'jwt_token';
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  });
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const validatingRef = useRef(false);

  // Optimistic hydration
  useEffect(() => {
    // If token exists we mark ready immediately (avoid redirect flash)
    setIsReady(true);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Try primary auth endpoint; fall back to proxy if CORS/404
      const endpoints = [
        'https://auth-3778.onrender.com/login',
        '/api/auth/login',
        '/auth/login'
      ];
      let successToken = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
          });
          if (!res.ok) continue;
          const ct = (res.headers.get('content-type') || '').toLowerCase();
            if (!ct.includes('json')) continue;
          const json = await res.json();
          successToken = json.token || json.access_token || json.jwt || null;
          if (successToken) break;
        } catch {
          continue;
        }
      }
      // Offline / dev fallback (DON'T use in prod real auth)
      if (!successToken) {
        if (import.meta.env.DEV) {
          successToken = `dev-${Date.now()}`;
        } else {
          throw new Error('Authentication failed.');
        }
      }
      localStorage.setItem(TOKEN_KEY, successToken);
      setToken(successToken);
      setIsReady(true);
      return true;
    } catch (e) {
      setAuthError(e.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setToken(null);
  }, []);

  const value = {
    token,
    isAuthenticated: !!token,
    isReady,
    loading,
    authError,
    login,
    logout
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Defensive wrapper for places still using <EnsureAuthProvider>
export function EnsureAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
