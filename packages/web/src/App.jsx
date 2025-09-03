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

// Minimal ResourceSection (re‑introduced for pages importing from '@/App')
export const ResourceSection = ({
  title,
  hookResult,
  renderItem,
  emptyMessage = 'No records found.'
}) => {
  const data = hookResult?.data;
  const loading = hookResult?.loading;
  const error = hookResult?.error;
  const isEmpty =
    !loading &&
    !error &&
    (
      data == null ||
      (Array.isArray(data) && data.length === 0)
    );

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
            <div
              key={i}
              className="p-4 border border-gray-200 rounded-lg animate-pulse space-y-3"
            >
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
          {Array.isArray(data) ? data.map(renderItem) : renderItem?.(data)}
        </div>
      )}
    </section>
  );
};

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