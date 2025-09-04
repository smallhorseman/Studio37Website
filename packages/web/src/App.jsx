import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazyPage } from './utils/pageLoader';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Import utility for API fallback when API is unavailable
import './utils/apiFallbackShim';

// Lazy load all pages to reduce initial bundle size
const HomePage = lazyPage('HomePage');
const AboutPage = lazyPage('AboutPage');
const PortfolioPage = lazyPage('PortfolioPage');
const ServicesPage = lazyPage('ServicesPage');
const PackagesPage = lazyPage('PackagesPage');
const ContactPage = lazyPage('ContactPage');
const LoginPage = lazyPage('LoginPage');

const fallback = <div className="flex items-center justify-center min-h-screen">
  <div className="animate-pulse text-center">
    <div className="text-sm text-gray-500">Loading...</div>
  </div>
</div>;

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/packages" element={<Layout><PackagesPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="*" element={<Layout><div className="text-center py-20"><h1 className="text-4xl">Page Not Found</h1></div></Layout>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;