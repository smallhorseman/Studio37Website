import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { lazyPage } from './utils/pageLoader';
// Import Layout
import Layout from './components/Layout';

// Pages
const HomePage = lazyPage('HomePage');
const AboutPage = lazyPage('AboutPage');
const PortfolioPage = lazyPage('PortfolioPage');
const ServicesPage = lazyPage('ServicesPage');
const PackagesPage = lazyPage('PackagesPage');
const BlogPage = lazyPage('BlogPage');
const ContactPage = lazyPage('ContactPage');
const LoginPage = lazyPage('LoginPage');

// Protected routes
const ToolsPage = lazyPage('ToolsPage');
const AdminUpdatePage = lazyPage('AdminUpdatePage');
const CRMPage = lazyPage('CRMPage');
const TodoPage = lazyPage('TodoPage');
const DashboardPage = lazyPage('DashboardPage');

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('jwt_token'));
  
  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Please login to access this page</p>
        <a href="/login" className="btn btn-primary">Login</a>
      </div>
    );
  }
  
  return children;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Login page (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Public routes with layout */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
              <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
              <Route path="/packages" element={<Layout><PackagesPage /></Layout>} />
              <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              
              {/* Protected routes with layout */}
              <Route path="/internal-dashboard" element={
                <ProtectedRoute>
                  <Layout><ToolsPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout><AdminUpdatePage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/crm" element={
                <ProtectedRoute>
                  <Layout><CRMPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/todos" element={
                <ProtectedRoute>
                  <Layout><TodoPage /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Layout><HomePage /></Layout>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}