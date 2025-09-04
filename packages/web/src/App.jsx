import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { lazyPage, warmPreload } from './utils/pageLoader';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { installChunkErrorReload } from './utils/lazy';
import ErrorBoundary from './components/ErrorBoundary';

// Install chunk error handler
installChunkErrorReload();

// Lazy-load pages
const HomePage = lazyPage('HomePage');
const AboutPage = lazyPage('AboutPage');
const PortfolioPage = lazyPage('PortfolioPage');
const ServicesPage = lazyPage('ServicesPage');
const LoginPage = lazyPage('LoginPage');
const ToolsPage = lazyPage('ToolsPage');
const AdminUpdatePage = lazyPage('AdminUpdatePage');
const CRMPage = lazyPage('CRMPage');
const TodoPage = lazyPage('TodoPage');
const PackagesPage = lazyPage('PackagesPage');
const BlogPage = lazyPage('BlogPage');
const ContactPage = lazyPage('ContactPage');
const ProjectsPage = lazyPage('ProjectsPage');
const DashboardPage = lazyPage('DashboardPage');

export default function App() {
  React.useEffect(() => {
    warmPreload();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/internal-dashboard" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminUpdatePage /></ProtectedRoute>} />
                <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
                <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                {/* Fallback for any other path */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </React.Suspense>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}