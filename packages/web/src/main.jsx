import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global fetch patch for API auth and 401 handling
if (typeof window !== 'undefined' && !window.__fetch_patch_installed__) {
  window.__fetch_patch_installed__ = true;
  const originalFetch = window.fetch.bind(window);
  const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';

  const isApiRequest = (url) => {
    if (url.startsWith('/api/')) return true;
    try {
      const remoteApiHost = new URL(import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com').host;
      const requestHost = new URL(url).host;
      return requestHost === remoteApiHost;
    } catch {
      return false;
    }
  };

  window.fetch = async (input, init = {}) => {
    const urlStr = typeof input === 'string' ? input : input.url;
    let usedAuth = false;

    if (isApiRequest(urlStr)) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        init.headers = new Headers(init.headers || {});
        if (!init.headers.has('Authorization')) {
          init.headers.set('Authorization', `Bearer ${token}`);
          usedAuth = true;
        }
      }
    }

    const response = await originalFetch(input, init);

    if (response.status === 401 && usedAuth) {
      if (API_DEBUG) console.warn('[Auth] Received 401 on authenticated request, logging out.', urlStr);
      localStorage.removeItem('jwt_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return response;
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);