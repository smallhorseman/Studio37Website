import { useEffect } from 'react';
import {
  REMOTE_API_BASE,
  PROXY_API_BASE,
  API_COMMON_PATHS,
  isSameOrigin
} from '@/config/env';

export default function ApiFetchFallback() {
  useEffect(() => {
    const remoteOrigin = (() => {
      try { return new URL(REMOTE_API_BASE).origin; } catch { return null; }
    })();
    if (!remoteOrigin) return;

    const originalFetch = window.fetch;

    window.fetch = async function patchedFetch(input, init) {
      try {
        const request = typeof input === 'string' ? input : input.url;
        const urlObj = new URL(request, window.location.href);
        const isRemote = remoteOrigin && urlObj.origin === remoteOrigin;

        // If not hitting remote API, just proceed
        if (!isRemote) {
          return await originalFetch(input, init);
        }

        // Try remote first
        let res;
        try {
            res = await originalFetch(request, init);
        } catch (e) {
          res = e;
        }

        const shouldRetry =
          // Network / thrown error (no response)
          !(res instanceof Response) ||
          // CORS blocked (opaque) or 404 missing CORS (status 404 + no access to body fields)
          (res instanceof Response && (res.type === 'opaque' || res.status === 0)) ||
          (res instanceof Response && res.status === 404);

        if (!shouldRetry || !(res instanceof Response)) {
          if (res instanceof Response) return res;
        }

        // Build fallback path:
        // If original path already has /api, just proxy as-is (strip domain)
        const path = urlObj.pathname + urlObj.search;

        let proxyPath = path;
        if (!proxyPath.startsWith('/api/')) {
          // For common top-level endpoints missing /api prefix, add it
            if (API_COMMON_PATHS.some(p => proxyPath.startsWith(p))) {
            proxyPath = '/api' + proxyPath;
          }
        }

        // Retry through proxy (relative) – preserves credentials if set
        const proxyUrl = proxyPath;
        const second = await originalFetch(proxyUrl, init);

        return second;
      } catch (finalError) {
        return Promise.reject(finalError);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
