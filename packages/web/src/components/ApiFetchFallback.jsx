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
    if (u.pathname.startsWith('/api/')) return u.pathname + u.search;
    let path = u.pathname;
    if (API_COMMON_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
      path = '/api' + path;
    } else if (!path.startsWith('/api/') && FORCE_API_PROXY) {
      path = '/api' + path;
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

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init) => {
      const reqUrl = typeof input === 'string' ? input : input.url;
      let forceProxy = FORCE_API_PROXY;
      try {
        const u = new URL(reqUrl, window.location.href);
        if (u.origin === remoteOrigin) forceProxy = true;
      } catch { /* ignore */ }

      if (forceProxy) {
        return originalFetch(toProxyPath(reqUrl), init);
      }

      try {
        const res = await originalFetch(reqUrl, init);
        if (res.status === 404 || res.type === 'opaque') {
          const proxyPath = toProxyPath(reqUrl);
            if (proxyPath !== reqUrl) return originalFetch(proxyPath, init);
        }
        return res;
      } catch (err) {            // CHANGED: capture error
        const proxyPath = toProxyPath(reqUrl);
        if (proxyPath !== reqUrl) return originalFetch(proxyPath, init);
        throw err;               // CHANGED: rethrow original error
      }
    };

    const OriginalXHR = window.XMLHttpRequest;
    function PatchedXHR() {
      const xhr = new OriginalXHR();
      const origOpen = xhr.open;
      xhr.open = function(method, url, ...rest) {
        try {
          const u = new URL(url, window.location.href);
          if (u.origin === remoteOrigin || FORCE_API_PROXY) {
            url = toProxyPath(url);
          }
        } catch { /* ignore */ }
        return origOpen.call(xhr, method, url, ...rest);
      };
      return xhr;
    }
    window.XMLHttpRequest = PatchedXHR;

    const patchAxios = () => {
      if (!window.axios || window.axios.__studio37_patched) return;
      window.axios.__studio37_patched = true;
      window.axios.interceptors.request.use(cfg => {
        try {
          const u = new URL(cfg.url, cfg.baseURL || window.location.href);
          if (u.origin === remoteOrigin || FORCE_API_PROXY) {
            cfg.url = toProxyPath(u.href);
            cfg.baseURL = '';
          }
        } catch { /* ignore */ }
        return cfg;
      });
    };
    patchAxios();
    const axiosInterval = setInterval(patchAxios, 500);
    setTimeout(() => clearInterval(axiosInterval), 5000);

    return () => {
      window.fetch = originalFetch;
      window.XMLHttpRequest = OriginalXHR;
    };
  }, []);

  return null;
}
