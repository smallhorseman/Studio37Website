import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import { lazyPage } from './utils/pageLoader';

// Direct imports of pages (static routes)
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

// Layout wrapper with header and footer
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  // This is a simplified version - implement proper auth check
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
              {/* Public routes with layout */}
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
              <Route path="/portfolio" element={<MainLayout><PortfolioPage /></MainLayout>} />
              <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
              <Route path="/packages" element={<MainLayout><PackagesPage /></MainLayout>} />
              <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
              
              {/* Login page (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes with layout */}
              <Route path="/internal-dashboard" element={
                <ProtectedRoute>
                  <MainLayout><ToolsPage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <MainLayout><AdminUpdatePage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/crm" element={
                <ProtectedRoute>
                  <MainLayout><CRMPage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/todos" element={
                <ProtectedRoute>
                  <MainLayout><TodoPage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout><DashboardPage /></MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}