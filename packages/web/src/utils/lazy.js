import React from 'react';

// __BUILD_TIME__ injected via Vite define
const BUILD_TAG = (typeof __BUILD_TIME__ !== 'undefined' && __BUILD_TIME__) || Date.now();

export function lazyWithRetry(importer) {
  return React.lazy(() =>
    importer()
      .then(m => m)
      .catch(err => {
        const msg = (err && err.message) || '';
        const isChunkErr =
          /Loading chunk|Failed to fetch dynamically imported module|dynamic import/i.test(msg);
        if (isChunkErr && typeof window !== 'undefined') {
            const attempts = (window.__chunk_retry__ = (window.__chunk_retry__ || 0) + 1);
          if (attempts <= 1) {
            // Retry once after a short delay (cache-busting query already in importer)
            return new Promise((resolve, reject) =>
              setTimeout(() => importer().then(resolve).catch(reject), 150)
            );
          }
        }
        throw err;
      })
  );
}

// Optional global listener (can be called once in App) to hard-reload if chunk keeps failing
export function installChunkErrorReload() {
  if (typeof window === 'undefined' || window.__chunk_reload_installed__) return;
  window.__chunk_reload_installed__ = true;
  window.addEventListener('error', e => {
    if (
      e?.message &&
      /loading dynamically imported module|import/i.test(e.message) &&
      !window.__chunk_hard_reloaded__
    ) {
      window.__chunk_hard_reloaded__ = true;
      // Force a full reload (bypass potential stale service worker/CDN)
      window.location.reload();
    }
  });
}

// Helper to append build tag to static import paths
export function withBuildTag(path) {
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${encodeURIComponent(BUILD_TAG)}`;
}
