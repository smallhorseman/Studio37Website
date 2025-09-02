import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext
} from 'react';

// Base URL for auth service (set VITE_AUTH_BASE_URL in production to Render auth service)
const AUTH_BASE = (import.meta.env.VITE_AUTH_BASE_URL || '/auth').replace(/\/+$/, '');

// Single context instance
const AuthContext = createContext(undefined);

// One-time warning for fallback usage
let warned = false;
function fallbackAuth() {
  if (!warned && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('[auth] useAuth fallback: rendered outside <AuthProvider>.');
    warned = true;
  }
  return {
    token: null,
    isAuthenticated: false,
    isReady: true,
    loading: false,
    authError: null,
    login: async () => false,
    logout: () => {},
    getAuthHeader: () => ({}),
    assertReadyAndAuthed: () => false,
    fetchWithAuth: async () => { throw new Error('No auth provider available'); },
  };
}

function useProvideAuth() {
  const bootstrapped = useRef(false);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isAuthenticated = !!token;

  // Bootstrap stored token
  useEffect(() => {
    if (!bootstrapped.current) {
      const stored = localStorage.getItem('token');
      if (stored) setToken(stored);
      bootstrapped.current = true;
      setIsReady(true);
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'token') setToken(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
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

  const assertReadyAndAuthed = () => {
    if (!isReady) throw new Error('Auth not initialized');
    if (!isAuthenticated) throw new Error('Not authenticated');
    return true;
  };

  const fetchWithAuth = useCallback(async (input, init = {}) => {
    if (!token) throw new Error('No auth token');
    const headers = { ...(init.headers || {}), Authorization: `Bearer ${token}` };
    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    return res;
  }, [token, logout]);

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
    fetchWithAuth,
  };
}

// Provider
export function AuthProvider({ children }) {
  const value = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value }, children);
}

// Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || fallbackAuth();
}

// Defensive wrapper (optional use)
export function EnsureAuthProvider({ children }) {
  const ctx = useContext(AuthContext);
if (ctx) return children;
return React.createElement(AuthProvider, null, children);
  if (ctx) return children;
  return React.createElement(AuthProvider, null, children);
}

// NOTE: AUTH_BASE comes from VITE_AUTH_BASE_URL. For production set it to the Render auth service URL
// e.g. https://your-auth-service.onrender.com/auth so no frontend route handling is required.
// SAFE hook (modified)
export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || fallbackAuthObject();
}

// Optional guard component to wrap legacy pages that might not be inside provider
export function EnsureAuthProvider({ children }) {
  const ctx = useContext(AuthContext);
  if (ctx) return children;
  return <AuthProvider>{children}</AuthProvider>;
}
