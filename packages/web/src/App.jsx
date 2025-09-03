import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import './utils/apiFallbackShim'; // new: registers fetch fallback on import

// Lightweight fallback (was causing ReferenceError when missing)
const LoadingFallback = () => (
  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-soft-charcoal animate-pulse">
    Loading...
  </div>
);

// ...existing ResourceSection, Page, Layout, Protected, ToolsLayout (unchanged except Fallback removal)...
// ...existing ResourceSection code...
// ...existing Page, Layout, Protected, ToolsLayout code...

function App() {
  const isToolsSite = typeof window !== 'undefined' && window.location.hostname.includes('tools.');
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            {isToolsSite ? <ToolsLayout /> : <Layout />}
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;