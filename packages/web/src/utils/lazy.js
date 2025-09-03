import React from 'react';

// Build tag (not appended to dynamic import specifiers)
const BUILD_TAG = (typeof __BUILD_TIME__ !== 'undefined' && __BUILD_TIME__) || Date.now();

/**
 * Wrap React.lazy with a single retry for transient chunk load failures.
 */
export function lazyWithRetry(importer) {
  return React.lazy(() =>
    importer()
      .then(mod => mod)
      .catch(err => {
        const msg = String(err?.message || '');
        const isChunkErr = /Loading chunk|Failed to fetch dynamically imported module|dynamic import/i.test(msg);
        if (isChunkErr && typeof window !== 'undefined') {
          const attempts = (window.__chunk_retry__ = (window.__chunk_retry__ || 0) + 1);
          if (attempts <= 1) {
            return new Promise((resolve, reject) =>
              setTimeout(() => {
                importer().then(resolve).catch(reject);
              }, 200)
            );
          }
        }
        throw err;
      })
  );
}

/**
 * Installs a global listener to hard-reload once if chunks keep failing.
 */
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

/**
 * Helper to append build tag to arbitrary (non-module) resource URLs if needed.
 * (Not used for import specifiers to avoid MIME/type issues.)
 */
export function withBuildTag(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(BUILD_TAG)}`;
}
