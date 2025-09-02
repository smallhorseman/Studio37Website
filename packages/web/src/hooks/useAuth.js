import { useState, useEffect, useCallback } from 'react';

// Auth service base URL (e.g. https://auth.yourdomain.com/auth or same origin /auth)
const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL?.replace(/\/+$/, '') ||
  '/auth';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
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
        credentials: 'include', // in case cookies are used
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error(`Login failed (${res.status})`);
      }

      const data = await res.json();
      // Support either access_token or token field
      const receivedToken = data.access_token || data.token;
      if (!receivedToken) {
        throw new Error('No token received');
      }
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
    // Optional: call backend logout if it exists
    try {
      await fetch(`${AUTH_BASE}/logout`, { method: 'POST', credentials: 'include' })
        .catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, []);

  const getAuthHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

  return {
    token,
    isAuthenticated,
    loading,
    authError,
    login,
    logout,
    getAuthHeader,
  };
}
