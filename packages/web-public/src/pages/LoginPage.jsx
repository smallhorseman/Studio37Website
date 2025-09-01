import React from 'react';
import Studio37Logo from '../components/Studio37Logo'; // Corrected: No curly braces

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Studio37Logo className="h-24 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Tools Login
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}