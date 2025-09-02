import { useState, useEffect, useCallback, useRef } from 'react';

// Auth service base URL (e.g. https://auth.yourdomain.com/auth or same origin /auth)
const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL?.replace(/\/+$/, '') ||
  '/auth';

export function useAuth() {
  const bootstrapped = useRef(false);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isAuthenticated = !!token;

  // Bootstrap token once
  useEffect(() => {
    if (!bootstrapped.current) {
      const stored = localStorage.getItem('token');
      if (stored) setToken(stored);
      bootstrapped.current = true;
      setIsReady(true);
    }
  }, []);

  // Storage sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error(`Login failed (${res.status})`);
      const data = await res.json();
      const receivedToken = data.access_token || data.token;
      if (!receivedToken) throw new Error('No token received');
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      return true;
    } catch (e) {
      setAuthError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${AUTH_BASE}/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, []);

  const getAuthHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

  // Optional guard utility for pages making API calls
  const assertReadyAndAuthed = () => {
    if (!isReady) throw new Error('Auth not initialized');
    if (!isAuthenticated) throw new Error('Not authenticated');
    return true;
  };

  return {
    token,
    isAuthenticated,
    isReady,
    loading,
    authError,
    login,
    logout,
    getAuthHeader,
    assertReadyAndAuthed,
  };
}
