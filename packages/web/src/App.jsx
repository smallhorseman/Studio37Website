import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Studio37Logo from './components/Studio37Logo';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Lazy loaded pages (public)
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Lazy loaded tools
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CRMPage = lazy(() => import('./pages/CRMPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContentManagerPage = lazy(() => import('./pages/ContentManagerPage'));
const AdminUpdatePage = lazy(() => import('./pages/AdminUpdatePage'));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Reusable wrappers
const PageWrapper = ({ children }) => <div className="page">{children}</div>;
const PageNarrow = ({ children }) => <div className="page-narrow">{children}</div>;

// Protected route using Outlet (allows nesting)
const ProtectedOutlet = () => {
  const { token, isReady, loading } = useAuth();
  if (!isReady || loading) return <div className="loading-block">Checking access...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const ToolsLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-1 rounded shadow">
      Skip to main content
    </a>
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/internal-dashboard"><Studio37Logo className="h-10 w-auto" color="white" /></Link>
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
    <main id="main"><Outlet /></main>
  </div>
);

const PublicSiteLayout = () => (
  <div className="font-sans bg-vintage-cream text-soft-charcoal min-h-screen">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-1 rounded shadow">
      Skip to main content
    </a>
    <Header />
    <main id="main"><Outlet /></main>
    <Footer />
  </div>
);

const Fallback = () => (
  <div className="loading-block">
    <p>Loading...</p>
  </div>
);

export default function App() {
  const isToolsSite = window.location.hostname.includes('tools.');

  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<Fallback />}>
            {isToolsSite ? (
              <Routes>
                <Route path="/login" element={<PageNarrow><LoginPage /></PageNarrow>} />
                <Route element={<ToolsLayout />}>
                  <Route element={<ProtectedOutlet />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="internal-dashboard" element={<DashboardPage />} />
                    <Route path="admin" element={<AdminUpdatePage />} />
                    <Route path="crm" element={<CRMPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="cms" element={<ContentManagerPage />} />
                    <Route path="todos" element={<TodoPage />} />
                  </Route>
                  <Route path="*" element={<PageWrapper>404 Not Found</PageWrapper>} />
                </Route>
              </Routes>
            ) : (
              <Routes>
                <Route element={<PublicSiteLayout />}>
                  <Route index element={<PageWrapper><HomePage /></PageWrapper>} />
                  <Route path="about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                  <Route path="services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
                  <Route path="packages" element={<PageWrapper><PackagesPage /></PageWrapper>} />
                  <Route path="portfolio" element={<PageWrapper><PortfolioPage /></PageWrapper>} />
                  <Route path="blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
                  <Route path="blog/:slug" element={<PageWrapper><BlogPostPage /></PageWrapper>} />
                  <Route path="contact" element={<PageNarrow><ContactPage /></PageNarrow>} />
                  <Route path="admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
                  <Route path="admin/tools" element={<PageWrapper><ToolsPage /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper>404 Not Found</PageWrapper>} />
                </Route>
              </Routes>
            )}
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}