import React, {
  useState, useEffect, useCallback, useRef,
  createContext, useContext
} from 'react';
import { REMOTE_AUTH_BASE, PROXY_AUTH_BASE, isSameOrigin } from '@config/env';

// Determine same-origin
const REMOTE_IS_SAME_ORIGIN = (() => {
  try { return new URL(REMOTE_AUTH_BASE, window.location.href).origin === window.location.origin; }
  catch { return false; }
})();

const AuthContext = createContext(undefined);

// Fallback (no provider)
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

// Fetch with remote→proxy fallback
async function authFetch(path, options = {}, preferProxy = false) {
  const targets = [];
  if (preferProxy) targets.push(PROXY_AUTH_BASE);
  targets.push(REMOTE_AUTH_BASE);
  if (!REMOTE_IS_SAME_ORIGIN && !preferProxy) targets.push(PROXY_AUTH_BASE);

  let lastErr;
  for (const base of targets) {
    try {
      const res = await fetch(`${base}${path}`, options);
      return { res, baseUsed: base };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Auth fetch failed');
}

function useProvideAuth() {
  const bootstrapped = useRef(false);
  const failedRemoteRef = useRef(false);

  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isAuthenticated = !!token;

  // Load stored token
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
    const handler = e => { if (e.key === 'token') setToken(e.newValue); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      };
      const { res, baseUsed } = await authFetch('/login', payload, failedRemoteRef.current);
      if (!res.ok) throw new Error(`Login failed (${res.status})`);
      const data = await res.json();
      const receivedToken = data.access_token || data.token;
      if (!receivedToken) throw new Error('No token received');
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      if (baseUsed === PROXY_AUTH_BASE) failedRemoteRef.current = true;
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
      await authFetch('/logout', { method: 'POST', credentials: 'include' }, failedRemoteRef.current).catch(() => {});
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

  const fetchWithAuth = useCallback(async (pathOrUrl, init = {}) => {
    if (!token) throw new Error('No auth token');
    const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
    const headers = { ...(init.headers || {}), Authorization: `Bearer ${token}` };
    const opts = { ...init, headers, credentials: init.credentials || 'include' };

    if (isAbsolute) {
      const res = await fetch(pathOrUrl, opts);
      if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
      return res;
    }
    const { res, baseUsed } = await authFetch(pathOrUrl, opts, failedRemoteRef.current);
    if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
    if (baseUsed === PROXY_AUTH_BASE) failedRemoteRef.current = true;
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
    fetchWithAuth
  };
}

export function AuthProvider({ children }) {
  const value = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || fallbackAuth();
}

export function EnsureAuthProvider({ children }) {
  const ctx = useContext(AuthContext);
  if (ctx) return children;
  return React.createElement(AuthProvider, null, children);
}
// NOTE: AUTH_BASE comes from VITE_AUTH_BASE_URL. For production set it to the Render auth service URL
// e.g. https://your-auth-service.onrender.com/auth so no frontend route handling is required.

export function AuthProvider({ children }) {
  const value = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || fallbackAuth();
}

export function EnsureAuthProvider({ children }) {
  const ctx = useContext(AuthContext);
  if (ctx) return children;
  return React.createElement(AuthProvider, null, children);
}
// NOTE: AUTH_BASE comes from VITE_AUTH_BASE_URL. For production set it to the Render auth service URL
// e.g. https://your-auth-service.onrender.com/auth so no frontend route handling is required.
