import React from 'react';
import Studio37Logo from '../components/Studio37Logo';

// Tell the login page where to find the auth server
const AUTH_API_URL = import.meta.env.VITE_AUTH_URL;

export default function LoginPage() {
  const handleLogin = async (event) => {
    event.preventDefault();
    // This is a placeholder for your actual login logic
    console.log(`Attempting to log in to: ${AUTH_API_URL}/login`);
    // Here you would fetch from `${AUTH_API_URL}/login`
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Studio37Logo className="h-24 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tools Login</h2>
        <form onSubmit={handleLogin}>
          {/* ... your form inputs ... */}
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}