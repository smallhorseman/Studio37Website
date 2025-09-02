import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Studio37Logo from '../components/Studio37Logo';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
  // Use login from useAuth to handle authentication
  const result = await login(username, password);
  if (!result.success) throw new Error(result.message || 'Login failed!');
  navigate('/internal-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6"><Studio37Logo className="h-24 w-auto" /></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tools Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}