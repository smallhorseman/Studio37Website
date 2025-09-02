import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Pages (lazy)
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
const LoginPage = lazy(() => import('./pages/LoginPage'));

const Page = ({ children, narrow }) => (
  <div className={`${narrow ? 'max-w-3xl' : 'max-w-6xl'} mx-auto px-4 py-12`}>{children}</div>
);

const Layout = () => (
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

const Fallback = () => (
  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-soft-charcoal animate-pulse">
    Loading...
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<Fallback />}>
            <Layout />
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}