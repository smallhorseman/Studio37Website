import { API_BASE } from '@/config/env'; // FIX alias
import { getSeedForPath } from '@/data/seedContent';

const ENABLED = import.meta.env.VITE_ENABLE_API_SHIM === '1';
const DEBUG = !!import.meta.env.VITE_API_SHIM_DEBUG;

if (ENABLED && typeof window !== 'undefined' && !window.__api_fallback_shim_installed__) {
  window.__api_fallback_shim_installed__ = true;
  const originalFetch = window.fetch.bind(window);
  const allowRelative =
    import.meta.env.VITE_ALLOW_PROD_RELATIVE === '1' ||
    import.meta.env.VITE_ALLOW_PROD_RELATIVE === 'true';
  let apiHost = null;
  try {
    const apiBaseResolved = (API_BASE || import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com');
    apiHost = new URL(apiBaseResolved).host;
  } catch { /* ignore */ }

  const RESOURCE_ROOTS = [
    // NOTE: In production /api/* should be forwarded by Netlify _redirects (see /public/_redirects).
    { re: /\/packages\/?(\?|$)/, rel: '/api/packages' },
    { re: /\/services\/?(\?|$)/, rel: '/api/services' },
    { re: /\/projects\/?(\?|$)/, rel: '/api/projects' },
    { re: /\/cms\/posts\/?(\?|$)/, rel: '/api/cms/posts' },
    { re: /\/crm\/?(\?|$)/, rel: '/api/crm' },     // NEW
    { re: /\/tasks\/?(\?|$)/, rel: '/api/tasks' }  // NEW
  ];

  window.fetch = async function patchedFetch(input, init) {
    if (!allowRelative) return originalFetch(input, init);
    const urlStr = typeof input === 'string' ? input : input?.url || '';
    const match = RESOURCE_ROOTS.find(r => r.re.test(urlStr));
    if (!match) return originalFetch(input, init);

    const urlObj = (() => { try { return new URL(urlStr, window.location.href); } catch { return null; } })();
    // Treat as API-bound if it already targets API_BASE host OR it is a same-origin relative path (we will attempt proxy + seed)
    const isApiHost = (() => {
      try {
        if (!urlObj) return false;
        return urlObj.href.startsWith(API_BASE) ||
          (apiHost && urlObj.host === apiHost) ||
          (urlObj.origin === window.location.origin); // allow relative for rewrite
      } catch { return false; }
    })();
    if (!isApiHost) return originalFetch(input, init);

    // If the original call was relative (same origin) and not already /api/, build a synthetic absolute to API_BASE for first attempt.
    let firstTarget = input;
    if (urlObj && urlObj.origin === window.location.origin && !/\/api\//.test(urlObj.pathname)) {
      try {
        const abs = new URL(match.rel + urlObj.search, API_BASE);
        firstTarget = abs.toString();
        if (DEBUG) console.warn('[apiShim] upgrading relative to absolute API', { from: urlStr, to: firstTarget });
      } catch { /* ignore */ }
    }

    try {
      const res = await originalFetch(firstTarget, init);
      const ct = res.headers.get('content-type') || '';
      const looksHtml = ct.includes('text/html');
      if ((!res.ok && looksHtml) || res.status === 404) {
        const rel = toRelative(urlStr, match.rel);
        if (rel) {
          if (DEBUG) console.warn('[apiShim] retry', { from: urlStr, to: rel, status: res.status });
          const proxyRes = await originalFetch(rel, init).catch(() => null);
          if (proxyRes && proxyRes.ok) return proxyRes;
          const seed = safeSeed(urlStr);
          if (seed) return seed;
          return proxyRes || res;
        }
      }
      // If API returns HTML (CORS or app shell) but status ok => seed fallback
      if (res.ok && (ct.includes('text/html'))) {
        const seed = safeSeed(urlStr);
        if (seed) return seed;
      }
      return res;
    } catch (e) {
      const rel = toRelative(urlStr, match.rel);
      if (rel) {
        try {
          if (DEBUG) console.warn('[apiShim] network error, retry', { from: urlStr, to: rel, error: e?.message });
          const proxyRes = await originalFetch(rel, init).catch(() => null);
          if (proxyRes && proxyRes.ok) return proxyRes;
          const seed = safeSeed(urlStr);
          if (seed) return seed;
          return proxyRes || Promise.reject(e);
        } catch { /* ignore */ }
      }
      const seed = safeSeed(urlStr);
      if (seed) return seed;
      throw e;
    }
  };

  function toRelative(full, relBase) {
    try {
      const u = new URL(full, window.location.href);
      return relBase + u.search;
    } catch {
      return null;
    }
  }

  function safeSeed(fullUrl) {
    try {
      const u = new URL(fullUrl, window.location.href);
      const normalizedPath = u.pathname.replace(/^\/api(?=\/)/, '');
      const data = getSeedForPath(normalizedPath);
      if (!data) return null;
      if (DEBUG) console.warn('[apiShim] serving seed data for', normalizedPath);
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      return new Response(blob, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Seed-Data': '1' }
      });
    } catch {
      return null;
    }
  }
}
