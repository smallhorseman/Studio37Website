import React, { useState, useEffect } from 'react';
import { useAuth, EnsureAuthProvider } from '@/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Studio37Logo from '../components/Studio37Logo';

function LoginPageInner() {
  const { login, loading, authError, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const [nextPath, setNextPath] = useState('/internal-dashboard');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const np = params.get('next');
    if (np) setNextPath(np);
  }, [location.search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await login(form.username, form.password);
    navigate(nextPath || '/internal-dashboard', { replace: true });
  };

  if (isAuthenticated) {
    return <div className="page-narrow">Already logged in.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6"><Studio37Logo className="h-24 w-auto" /></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tools Login</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal"
              autoComplete="username"
            />
          </div>
          <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal"
                autoComplete="current-password"
              />
          </div>
          {authError && <div className="error-block">{authError}</div>}
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <EnsureAuthProvider>
      <LoginPageInner />
    </EnsureAuthProvider>
  );
}