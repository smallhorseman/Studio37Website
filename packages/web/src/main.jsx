import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global fetch auth header injector (idempotent)
if (typeof window !== 'undefined' && !window.__api_auth_fetch_patch__) {
  window.__api_auth_fetch_patch__ = true;
  const ORIG_FETCH = window.fetch.bind(window);
  const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';
  const API_BASE_HOST = (() => {
    try {
      const base = (import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com').trim();
      return new URL(base).host;
    } catch { return null; }
  })();
  const AUTH_EVENT_FLAG = '__auth_unauth_fired__';
  const last401 = new Map(); // url -> ts
  const PUBLIC_401_OK = [/\/api\/packages\b/i, /\/api\/services\b/i]; // allow unauth 401 without clearing

  window.fetch = async (input, init = {}) => {
    const urlStr = typeof input === 'string' ? input : input?.url || '';
    let usedAuthHeader = false;
    try {
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
      if (token) {
        // same-origin /api/* OR absolute pointing to API_BASE host
        const isAbsolute = /^https?:\/\//i.test(urlStr);
        let hostMatch = false;
        if (isAbsolute && API_BASE_HOST) {
          try { hostMatch = new URL(urlStr).host === API_BASE_HOST; } catch { /* ignore */ }
        }
        const needsAuth = /\/api\//.test(urlStr) && (!isAbsolute || hostMatch);
        if (needsAuth) {
          const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined) || {});
          if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
            usedAuthHeader = true; // NEW
          } else {
            usedAuthHeader = true;
          }
          if (!headers.has('Accept')) headers.set('Accept', 'application/json');
          init.headers = headers;
          if (API_DEBUG) console.warn('[fetch+auth]', urlStr);
        }
      }
    } catch { /* ignore */ }

    const res = await ORIG_FETCH(input, init);

    // 401 handling + throttle (avoid spamming same failing endpoint)
    if (res && res.status === 401) {
      const isPublic = PUBLIC_401_OK.some(re => re.test(urlStr));
      if (usedAuthHeader && !isPublic) { // NEW condition
        const now = Date.now();
        const prev = last401.get(urlStr) || 0;
        last401.set(urlStr, now);
        if (now - prev < 1500) {
          if (API_DEBUG) console.warn('[fetch+auth][401-throttle]', urlStr);
        }
        try {
          const hadToken = localStorage.getItem('jwt_token');
          if (hadToken) localStorage.removeItem('jwt_token');
        } catch { /* ignore */ }
        if (!window[AUTH_EVENT_FLAG]) {
          window[AUTH_EVENT_FLAG] = true;
          window.dispatchEvent(new Event('auth:unauthorized'));
          if (API_DEBUG) console.warn('[auth] dispatched auth:unauthorized (401)', urlStr);
          // reset flag after short delay to allow future re-auth cycles
          setTimeout(() => { window[AUTH_EVENT_FLAG] = false; }, 4000);
        }
      } else if (API_DEBUG && !usedAuthHeader) {
        console.warn('[fetch+auth][401-public-or-no-auth]', urlStr);
      }
    }

    return res;
  };
}

// NEW: 404 monitor for /api/* indicating missing redirects
if (typeof window !== 'undefined' && !window.__api_404_probe__) {
  window.__api_404_probe__ = true;
  const origFetch = window.fetch;
  window.fetch = async (i, init) => {
    const res = await origFetch(i, init);
    try {
      const urlStr = typeof i === 'string' ? i : i?.url || '';
      if (/\/api\//.test(urlStr) && res.status === 404) {
        window.__api_404_count = (window.__api_404_count || 0) + 1;
        if (window.__api_404_count === 3) {
          // eslint-disable-next-line no-console
          console.warn('[API] Repeated 404s on /api/* - ensure Netlify redirects or set VITE_API_URL to external API host.');
        }
      }
    } catch { /* ignore */ }
    return res;
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);