// packages/web-public/src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import all our final page components
import DashboardPage from './pages/DashboardPage';
import InternalDashboardPage from './pages/InternalDashboardPage';
import AdminUpdatePage from './pages/AdminUpdatePage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage'; // <-- UPDATED: Correct component name
import TodoPage from './pages/TodoPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold hover:text-gray-300">Studio 37 Tools</Link>
            <div className="space-x-4">
                <Link to="/" className="px-2 py-1 rounded hover:bg-gray-700">Analyzer</Link>
                <Link to="/internal-dashboard" className="px-2 py-1 rounded hover:bg-gray-700">Dashboard</Link>
                <Link to="/crm" className="px-2 py-1 rounded hover:bg-gray-700">CRM</Link>
                <Link to="/projects" className="px-2 py-1 rounded hover:bg-gray-700">Projects</Link>
                <Link to="/cms" className="px-2 py-1 rounded hover:bg-gray-700">CMS</Link>
                <Link to="/todos" className="font-bold text-yellow-400 px-2 py-1 rounded hover:bg-gray-700">To-Do</Link>
                <Link to="/admin" className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500">Admin</Link>
            </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/internal-dashboard" element={<InternalDashboardPage />} />
          <Route path="/admin" element={<AdminUpdatePage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/cms" element={<ContentManagerPage />} /> {/* <-- UPDATED: Correct component name */}
          <Route path="/todos" element={<TodoPage />} />
        </Routes>
      </main>
    </div>
  );
}