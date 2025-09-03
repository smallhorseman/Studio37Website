import { API_BASE } from '@config/env';

const ENABLED = import.meta.env.VITE_ENABLE_API_SHIM === '1';
const DEBUG = !!import.meta.env.VITE_API_SHIM_DEBUG;

if (ENABLED && typeof window !== 'undefined' && !window.__api_fallback_shim_installed__) {
  window.__api_fallback_shim_installed__ = true;
  const originalFetch = window.fetch.bind(window);
  const allowRelative =
    import.meta.env.VITE_ALLOW_PROD_RELATIVE === '1' ||
    import.meta.env.VITE_ALLOW_PROD_RELATIVE === 'true';
  let apiHost = null;
  try { apiHost = new URL(API_BASE).host; } catch { /* ignore */ }

  const RESOURCE_ROOTS = [
    { re: /\/packages\/?(\?|$)/, rel: '/api/packages' },
    { re: /\/services\/?(\?|$)/, rel: '/api/services' },
    { re: /\/projects\/?(\?|$)/, rel: '/api/projects' },
    { re: /\/cms\/posts\/?(\?|$)/, rel: '/api/cms/posts' },
  ];

  window.fetch = async function patchedFetch(input, init) {
    if (!allowRelative) return originalFetch(input, init);
    const urlStr = typeof input === 'string' ? input : input?.url || '';
    const match = RESOURCE_ROOTS.find(r => r.re.test(urlStr));
    if (!match) return originalFetch(input, init);

    const isApiHost = (() => {
      try {
        const u = new URL(urlStr, window.location.href);
        return u.href.startsWith(API_BASE) || (apiHost && u.host === apiHost);
      } catch { return false; }
    })();
    if (!isApiHost) return originalFetch(input, init);

    try {
      const res = await originalFetch(input, init);
      const ct = res.headers.get('content-type') || '';
      const looksHtml = ct.includes('text/html');
      if ((!res.ok && looksHtml) || res.status === 404) {
        const rel = toRelative(urlStr, match.rel);
        if (rel) {
          if (DEBUG) console.warn('[apiShim] retry', { from: urlStr, to: rel, status: res.status });
          return originalFetch(rel, init);
        }
      }
      return res;
    } catch (e) {
      const rel = toRelative(urlStr, match.rel);
      if (rel) {
        try {
          if (DEBUG) console.warn('[apiShim] network error, retry', { from: urlStr, to: rel, error: e?.message });
          return await originalFetch(rel, init);
        } catch { /* ignore */ }
      }
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
}
