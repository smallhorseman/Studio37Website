import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { API_BASE } from '@config/env'; // Generic API fallback shim for CORS/network failures on selected resource roots
if (typeof window !== 'undefined' && !window.__api_fallback_shim_installed__) {
  window.__api_fallback_shim_installed__ = true;
  const originalFetch = window.fetch.bind(window);
  const allowRelative = import.meta.env.VITE_ALLOW_PROD_RELATIVE === '1' || import.meta.env.VITE_ALLOW_PROD_RELATIVE === 'true';
  const apiHost = (() => { try { return new URL(API_BASE).host; } catch { return null; } })();

  // Resource roots we want to auto‑retry through /api proxy
  const RESOURCE_ROOTS = [
    { re: /\/packages\/?(\?|$)/, rel: '/api/packages' },
    { re: /\/services\/?(\?|$)/, rel: '/api/services' },
    { re: /\/projects\/?(\?|$)/, rel: '/api/projects' },
    { re: /\/cms\/posts\/?(\?|$)/, rel: '/api/cms/posts' },
  ];

  // Build a relative proxy path from an absolute URL and the target rel root
  function buildRelative(absUrl, relRoot) {
    try {
      const u = new URL(absUrl, window.location.href);
      const segments = u.pathname.split('/').filter(Boolean);
      // Drop the original leading resource root (e.g. 'packages')
      segments.shift();
      const tail = segments.join('/');
      return relRoot + (tail ? '/' + tail : '') + u.search + u.hash;
    } catch {
      return null;
    }
  }

  window.fetch = async function patchedFetch(input, init) {
    const urlStr = typeof input === 'string' ? input : input?.url || '';
    if (!allowRelative) return originalFetch(input, init);

    const match = RESOURCE_ROOTS.find(r => r.re.test(urlStr));
    if (!match) return originalFetch(input, init);

    // Only intervene for absolute calls to our API host (or direct API_BASE start)
    const isApiHost = (() => {
      try {
        const u = new URL(urlStr, window.location.href);
        return u.href.startsWith(API_BASE) || (apiHost && u.host === apiHost);
      } catch { return false; }
    })();
    if (!isApiHost) return originalFetch(input, init);

    // First attempt
    try {
      const res = await originalFetch(input, init);
      const ct = res.headers.get('content-type') || '';
      const looksHtml = ct.includes('text/html');
      // Fallback if HTML shell OR 404 (likely missing endpoint / CORS)
      if ((!res.ok && looksHtml) || res.status === 404) {
        const rel = buildRelative(urlStr, match.rel);
        if (rel) {
          return await originalFetch(rel, init);
        }
      }
      return res;
    } catch (err) {
      // Network/CORS failure: attempt direct relative fallback
      const rel = buildRelative(urlStr, match.rel);
      if (rel) {
        try {
          return await originalFetch(rel, init);
        } catch {
          // swallow and rethrow original
        }
      }
      throw err;
    }
  };
}

function App() {
  const isToolsSite = typeof window !== 'undefined' && window.location.hostname.includes('tools.');
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<Fallback />}>
            {isToolsSite ? <ToolsLayout /> : <Layout />}
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;