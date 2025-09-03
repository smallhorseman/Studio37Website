import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Conditional shim import only if enabled flag.
if (import.meta.env.VITE_ENABLE_API_SHIM === '1') {
  await import('./utils/apiFallbackShim');
}

// Lightweight fallback (was causing ReferenceError when missing)
const LoadingFallback = () => (
  <div className="max-w-6xl mx-auto px-4 py-12 text-center text-soft-charcoal animate-pulse">
    Loading...
  </div>
);

// ...existing ResourceSection code...
export const ResourceSection = React.memo(function ResourceSection({
   title,
   hookResult,
   renderItem,
   emptyMessage = 'No records found.'
}) {
  // ...existing code...
});

// ...existing Page, Layout, Protected, ToolsLayout code...

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