import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// UPDATED: Import your custom logo
import Studio37Logo from './components/Studio37Logo';

// --- Import all your pages ---
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage';
import InternalDashboardPage from './pages/InternalDashboardPage';
import AdminUpdatePage from './pages/AdminUpdatePage';
import TodoPage from './pages/TodoPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';

// UPDATED: ToolsLayout now uses the logo
const ToolsLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <Studio37Logo className="h-10 w-auto" color="white" />
        </Link>
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

// UPDATED: PublicSiteLayout now uses the logo
const PublicSiteLayout = ({ children }) => (
  <div>
    <nav style={{ padding: '1rem 2rem', backgroundColor: '#2d3748', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/" style={{ marginRight: 'auto' }}>
        <Studio37Logo className="h-10 w-auto" color="white" />
      </Link>
      <Link to="/about">About</Link>
      <Link to="/services">Services</Link>
      <Link to="/packages">Packages</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contact">Contact</Link>
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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/internal-dashboard" element={<InternalDashboardPage />} />
          <Route path="/admin" element={<AdminUpdatePage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/cms" element={<ContentManagerPage />} />
          <Route path="/todos" element={<TodoPage />} />
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