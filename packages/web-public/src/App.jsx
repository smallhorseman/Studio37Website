// packages/web-public/src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// --- Import Your Tool Pages ---
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage';
// ... import other tool pages

// --- Import Your PUBLIC Website Pages (You'll need to create these) ---
// Example:
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import BlogPage from './pages/BlogPage';


// Simple placeholder components for the public site - replace with your real ones
const HomePage = () => <div><h1>Welcome to Studio 37</h1><p>This is the PUBLIC home page.</p></div>;
const AboutPage = () => <div><h1>About Us</h1></div>;


const ToolsLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">Studio 37 Tools</Link>
          <div className="space-x-4">
              <Link to="/" className="px-2 py-1 rounded hover:bg-gray-700">Dashboard</Link>
              <Link to="/crm" className="px-2 py-1 rounded hover:bg-gray-700">CRM</Link>
              <Link to="/projects" className="px-2 py-1 rounded hover:bg-gray-700">Projects</Link>
              <Link to="/cms" className="px-2 py-1 rounded hover:bg-gray-700">CMS</Link>
          </div>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

const PublicSiteLayout = ({ children }) => (
  <div>
    <nav>
      {/* Your PUBLIC website navigation goes here */}
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
    </nav>
    <main>{children}</main>
  </div>
);


export default function App() {
  const hostname = window.location.hostname;

  // Check if the hostname is for the tools subdomain
  // This also works for localhost during development
  const isToolsSite = hostname.startsWith('tools.') || hostname === 'localhost';

  if (isToolsSite) {
    // --- RENDER THE INTERNAL TOOLS ---
    return (
      <ToolsLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/cms" element={<ContentManagerPage />} />
          {/* Add all other tool routes here */}
        </Routes>
      </ToolsLayout>
    );
  } else {
    // --- RENDER THE PUBLIC WEBSITE ---
    return (
      <PublicSiteLayout>
        {/* VVV --- ADD THIS TEST BANNER --- VVV */}
        <div style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '15px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
        }}>
            PUBLIC SITE TEST - If you see this, the new code is live.
        </div>
        {/* ^^^ --- ADD THIS TEST BANNER --- ^^^ */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add all other public routes here (e.g., /blog, /contact) */}
        </Routes>
      </PublicSiteLayout>
    );
  }
}