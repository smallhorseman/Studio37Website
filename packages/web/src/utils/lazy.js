import React from 'react';

// Keep build tag only for non-module cache busting (not applied to dynamic imports now)
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
            return new Promise((resolve, reject) =>
              setTimeout(() => importer().then(resolve).catch(reject), 200)
            );
          }
        }
        throw err;
      })
  );
}

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
      window.location.reload();
    }
  });
}

// Retained helper (unused for import specifiers now, can still be used for fetch URLs)
export function withBuildTag(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(BUILD_TAG)}`;
}
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${encodeURIComponent(BUILD_TAG)}`;
}
