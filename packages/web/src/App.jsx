import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Studio37Logo from './components/Studio37Logo';

// Tool Pages
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage';
import InternalDashboardPage from './pages/InternalDashboardPage';
import AdminUpdatePage from './pages/AdminUpdatePage';
import TodoPage from './pages/TodoPage';
import LoginPage from './pages/LoginPage';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';

// --- NEW: Protected Route Component ---
// This component checks for a login token. If it doesn't exist, it redirects to the login page.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ToolsLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/"><Studio37Logo className="h-10 w-auto" color="white" /></Link>
        <div className="space-x-4">
          <Link to="/internal-dashboard" className="px-2 py-1 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/crm" className="px-2 py-1 rounded hover:bg-gray-700">CRM</Link>
          <Link to="/projects" className="px-2 py-1 rounded hover:bg-gray-700">Projects</Link>
          <Link to="/cms" className="px-2 py-1 rounded hover:bg-gray-700">CMS</Link>
          <Link to="/todos" className="font-bold text-yellow-400 px-2 py-1 rounded hover:bg-gray-700">To-Do</Link>
          <Link to="/admin" className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500">Admin</Link>
        </div>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

const PublicSiteLayout = ({ children }) => (
  <div className="font-sans bg-vintage-cream text-soft-charcoal min-h-screen">
    <nav className="p-4 sm:px-8 flex justify-between items-center">
      <Link to="/" className="w-32"><Studio37Logo color="#36454F" /></Link>
      <div className="hidden sm:flex items-center gap-6">
        <Link to="/about" className="hover:text-warm-tan">About</Link>
        <Link to="/services" className="hover:text-warm-tan">Services</Link>
        <Link to="/portfolio" className="hover:text-warm-tan">Portfolio</Link>
        <Link to="/blog" className="hover:text-warm-tan">Blog</Link>
        <Link to="/contact" className="rounded-md bg-faded-teal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-soft-charcoal">Contact</Link>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

export default function App() {
  const hostname = window.location.hostname;
  const isToolsSite = hostname.startsWith('tools.') || hostname.startsWith('localhost');

  if (isToolsSite) {
    return (
      <ToolsLayout>
        <Routes>
          {/* The Login page is public */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* All other tool pages are now protected */}
          <Route path="/" element={<ProtectedRoute><InternalDashboardPage /></ProtectedRoute>} />
          <Route path="/internal-dashboard" element={<ProtectedRoute><InternalDashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminUpdatePage /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/cms" element={<ProtectedRoute><ContentManagerPage /></ProtectedRoute>} />
          <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
        </Routes>
      </ToolsLayout>
    );
  } else {
    return (
      <PublicSiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </PublicSiteLayout>
    );
  }
}