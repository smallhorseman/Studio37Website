import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react';

// Normalize base (can point to Render auth service or proxied /auth)
const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL?.replace(/\/+$/, '') || '/auth';

const AuthContext = createContext(null);

function useProvideAuth() {
  const bootstrapped = useRef(false);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const isAuthenticated = !!token;

  // Bootstrap once
  useEffect(() => {
    if (!bootstrapped.current) {
      const stored = localStorage.getItem('token');
      if (stored) setToken(stored);
      bootstrapped.current = true;
      setIsReady(true);
    }
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'token') setToken(e.newValue);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      setAuthError(null);
      try {
        const res = await fetch(`${AUTH_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
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
    },
    [AUTH_BASE]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${AUTH_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, [AUTH_BASE]);

  const getAuthHeader = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

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

export function AuthProvider({ children }) {
  const value = useProvideAuth();
  // Replaced JSX with createElement to avoid JSX transform requirement in .js file
  return React.createElement(AuthContext.Provider, { value }, children);
}

// Public hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
