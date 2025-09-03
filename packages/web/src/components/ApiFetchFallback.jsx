import { useEffect } from 'react';
import {
  REMOTE_API_BASE,
  PROXY_API_BASE,
  API_COMMON_PATHS,
  FORCE_API_PROXY
} from '@/config/env';

function toProxyPath(remoteUrl) {
  try {
    const u = new URL(remoteUrl, window.location.href);
    // Prevent double rewriting
    if (u.pathname.startsWith('/api/')) return u.pathname + u.search;
    // If the original already includes /api segment deeper, keep path as-is
    let path = u.pathname;
    if (API_COMMON_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
      path = '/api' + path;
    } else if (!path.startsWith('/api/')) {
      // Generic fallback: prefix /api only if FORCE_API_PROXY is enabled
      if (FORCE_API_PROXY) path = '/api' + path;
    }
    return path + u.search;
  } catch {
    return remoteUrl;
  }
}

export default function ApiFetchFallback() {
  useEffect(() => {
    const remoteOrigin = (() => {
      try { return new URL(REMOTE_API_BASE).origin; } catch { return null; }
    })();
    if (!remoteOrigin) return;

    // -------- Fetch patch --------
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const reqUrl = typeof input === 'string' ? input : input.url;
      let useProxy = FORCE_API_PROXY;
      try {
        const u = new URL(reqUrl, window.location.href);
        if (u.origin === remoteOrigin) useProxy = true;
      } catch {
        // ignore
      }

      if (useProxy) {
        const proxyPath = toProxyPath(reqUrl);
        return originalFetch(proxyPath, init);
      }

      // Try normal request first; if it fails with CORS/network, retry via proxy
      try {
        const res = await originalFetch(reqUrl, init);
        if (res.status === 404 || res.type === 'opaque') {
          const proxyPath = toProxyPath(reqUrl);
          if (proxyPath !== reqUrl) {
            return originalFetch(proxyPath, init);
          }
        }
        return res;
      } catch {
        const proxyPath = toProxyPath(reqUrl);
        if (proxyPath !== reqUrl) return originalFetch(proxyPath, init);
        throw;
      }
    };

    // -------- XMLHttpRequest patch (basic) --------
    const OriginalXHR = window.XMLHttpRequest;
    function PatchedXHR() {
      const xhr = new OriginalXHR();
      const origOpen = xhr.open;
      xhr.open = function(method, url, ...rest) {
        try {
          const u = new URL(url, window.location.href);
          if (u.origin === remoteOrigin || FORCE_API_PROXY) {
            const proxied = toProxyPath(url);
            return origOpen.call(xhr, method, proxied, ...rest);
          }
        } catch {
          // ignore
        }
        return origOpen.call(xhr, method, url, ...rest);
      };
      return xhr;
    }
    window.XMLHttpRequest = PatchedXHR;

    // -------- Axios patch (if loaded later) --------
    const patchAxios = () => {
      if (!window.axios || window.axios.__studio37_patched) return;
      window.axios.__studio37_patched = true;
      window.axios.interceptors.request.use(cfg => {
        try {
          const u = new URL(cfg.url, cfg.baseURL || window.location.href);
          if (u.origin === remoteOrigin || FORCE_API_PROXY) {
            cfg.url = toProxyPath(u.href);
            cfg.baseURL = ''; // ensure relative
          }
        } catch {
          // ignore
        }
        return cfg;
      });
    };
    patchAxios();
    const axiosInterval = setInterval(patchAxios, 500);
    setTimeout(() => clearInterval(axiosInterval), 5000); // stop after 5s

    return () => {
      window.fetch = originalFetch;
      window.XMLHttpRequest = OriginalXHR;
    };
  }, []);

  return null;
}
