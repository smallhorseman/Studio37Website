import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import our useAuth hook
import Studio37Logo from '../components/Studio37Logo';

export default function LoginPage() {
  // The form state remains the same
  const [email, setEmail] = useState(''); // Changed from username to email for consistency
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the login function from our context
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login function from our AuthContext
      const result = await login(email, password);

      if (result.success) {
        navigate('/internal-dashboard'); // Redirect on success
      } else {
        // Use the error message provided by the context
        setError(result.message || 'An unknown error occurred.');
      }
    } catch (err) {
      // Catch any unexpected errors during the process
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // The JSX is mostly the same, just updated to use 'email'
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6"><Studio37Logo className="h-24 w-auto" /></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tools Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@example.com" 
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="******************" 
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400 focus:outline-none focus:shadow-outline">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}