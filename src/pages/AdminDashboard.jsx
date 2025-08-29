import React from 'react';

export default function AdminDashboard({ onLogout }) {
  return (
    <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-[#36454F] sm:text-6xl font-serif">
          Admin Dashboard
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-700">
          Welcome to the command center. From here, we will manage the website content, clients, and projects.
        </p>
        <div className="mt-10">
          <button
            onClick={onLogout}
            className="rounded-md bg-[#D2B48C] px-3.5 py-2.5 text-sm font-semibold text-[#36454F] shadow-sm hover:bg-opacity-80"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
