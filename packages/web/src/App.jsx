import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// DIRECT (non-lazy) imports to rule out dynamic import side-effects while fixing syntax issue
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx'; // if missing, create a stub
import ServicesPage from './pages/ServicesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';
import AdminUpdatePage from './pages/AdminUpdatePage.jsx';
import CRMPage from './pages/CRMPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import PackagesPage from './pages/PackagesPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // if missing, create a stub

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Protected */}
              <Route path="/internal-dashboard" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminUpdatePage /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
              <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}