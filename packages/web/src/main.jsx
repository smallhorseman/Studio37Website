import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global fetch auth header injector (idempotent)
if (typeof window !== 'undefined' && !window.__api_auth_fetch_patch__) {
  window.__api_auth_fetch_patch__ = true;
  const ORIG_FETCH = window.fetch.bind(window);
  const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';
  window.fetch = async (input, init = {}) => {
    try {
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
      if (token) {
        const urlStr = typeof input === 'string' ? input : input?.url || '';
        const sameOrigin = !/^https?:\/\//i.test(urlStr) || urlStr.startsWith(window.location.origin);
        const isApi = /\/api\//.test(urlStr);
        if (sameOrigin && isApi) {
          const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined) || {});
            if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
            if (!headers.has('Accept')) headers.set('Accept', 'application/json');
          init.headers = headers;
          if (API_DEBUG) console.warn('[fetch+auth]', urlStr);
        }
      }
    } catch { /* ignore */ }
    return ORIG_FETCH(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);