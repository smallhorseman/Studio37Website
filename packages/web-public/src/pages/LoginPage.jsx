import React from 'react';
import { Studio37Logo } from '../App'; // Assuming we'll move the logo out of App.jsx later

export default function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd verify credentials here.
    // For now, we'll just call the onLogin function to simulate success.
    console.log('Simulating login...');
    onLogin();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#FFFDF6]">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Studio37Logo className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#36454F] font-serif">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-[#36454F]">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="admin@studio37.cc"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold leading-6 text-[#36454F]">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#468289] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#468289] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#36454F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36454F]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
