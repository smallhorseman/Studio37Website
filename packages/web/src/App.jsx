import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Side-effect shim import (internally checks enable flag)
import './utils/apiFallbackShim';

// Static page imports
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import ToolsPage from './pages/ToolsPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ProjectsPage from './pages/ProjectsPage';
import ContentManagerPage from './pages/ContentManagerPage';
import AdminUpdatePage from './pages/AdminUpdatePage';
import TodoPage from './pages/TodoPage';

// ResourceSection (unchanged logic)
export const ResourceSection = React.memo(function ResourceSection({
  title,
  hookResult,
  renderItem,
  emptyMessage = 'No records found.'
}) {
  const data = hookResult?.data;
  const loading = hookResult?.loading;
  const error = hookResult?.error;
  let list;
  if (Array.isArray(data)) list = data;
  else if (data == null) list = [];
  else {
    if (!ResourceSection._warned && typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('[ResourceSection] Expected array but received:', data);
      ResourceSection._warned = true;
    }
    list = [];
  }
  const isEmpty = !loading && !error && list.length === 0;
  return (
    <section className="mt-12">
      {title && (
        <h2 className="text-3xl font-serif tracking-tight text-soft-charcoal mb-6">
          {title}
        </h2>
      )}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse space-y-3">
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="text-center text-red-600">
          {error.message || 'Error loading data.'}
        </div>
      )}
      {isEmpty && (
        <div className="text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
      {!loading && !error && !isEmpty && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(renderItem)}
        </div>
      )}
    </section>
  );
});

// Simple loading fallback (in case future lazy reintroduced)
const LoadingFallback = () => (
  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-soft-charcoal animate-pulse">
    Loading...
  </div>
);

const Page = ({ children, narrow }) => (
  <div className={`${narrow ? 'max-w-3xl' : 'max-w-6xl'} mx-auto px-4 py-12`}>{children}</div>
);

// Main site layout
function Layout() {
  return (
    <div className="font-sans bg-vintage-cream text-soft-charcoal min-h-screen flex flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Routes>
          <Route index element={<Page><HomePage /></Page>} />
            <Route path="login" element={<Page narrow><LoginPage /></Page>} />
            <Route path="about" element={<Page><AboutPage /></Page>} />
            <Route path="services" element={<Page><ServicesPage /></Page>} />
            <Route path="packages" element={<Page><PackagesPage /></Page>} />
            <Route path="portfolio" element={<Page><PortfolioPage /></Page>} />
            <Route path="blog" element={<Page><BlogPage /></Page>} />
            <Route path="blog/:slug" element={<Page><BlogPostPage /></Page>} />
            <Route path="contact" element={<Page narrow><ContactPage /></Page>} />
            <Route path="admin" element={<Page><AdminPage /></Page>} />
            <Route path="admin/tools" element={<Page><ToolsPage /></Page>} />
            <Route path="*" element={<Page><div className="text-center text-gray-600">404 Not Found</div></Page>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Auth gate (stub still always unauthenticated)
const Protected = ({ children }) => {
  const { isAuthenticated, isReady, loading } = useAuth();
  if (!isReady || loading) return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse text-center">Checking access...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Tools subdomain layout
function ToolsLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/"><span className="font-semibold tracking-wide">Studio37 Tools</span></Link>
          <div className="flex gap-4 text-sm">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/crm" className="hover:underline">CRM</Link>
            <Link to="/projects" className="hover:underline">Projects</Link>
            <Link to="/cms" className="hover:underline">CMS</Link>
            <Link to="/todos" className="hover:underline">To‑Dos</Link>
            <Link to="/admin-update" className="hover:underline">Admin</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <Routes>
          <Route path="/login" element={<div className="max-w-md mx-auto"><LoginPage /></div>} />
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="cms" element={<ContentManagerPage />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="admin-update" element={<AdminUpdatePage />} />
          <Route path="*" element={<div className="text-center text-gray-600">Not Found</div>} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-500 py-4 border-t">Tools &copy; {new Date().getFullYear()}</footer>
    </div>
  );
}

function App() {
  const isToolsSite = typeof window !== 'undefined' && window.location.hostname.includes('tools.');
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          {isToolsSite ? <ToolsLayout /> : <Layout />}
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;