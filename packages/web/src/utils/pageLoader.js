import React from 'react';
import { lazyWithRetry } from '@/utils/lazy';

// Static glob so Vite includes every page chunk (prevents missing dynamic import issues)
const pageModules = import.meta.glob('@/pages/*.jsx');

// Helper: name must match file (e.g. 'AboutPage', 'HomePage')
export function lazyPage(name) {
  const key = `/src/pages/${name}.jsx`;
  const loader = pageModules[key];
  if (!loader) {
    // eslint-disable-next-line no-console
    console.warn(`[pageLoader] No module found for ${key}`);
    // Fallback dummy component - using createElement instead of JSX
    return React.lazy(() => Promise.resolve({ 
      default: () => React.createElement('div', null, `Missing page: ${name}`) 
    }));
  }
  return lazyWithRetry(() => loader());
}

// Optional eager preload (call once after App mounts if desired)
let preloaded = false;
export function warmPreload() {
  if (preloaded) return;
  preloaded = true;
  Object.values(pageModules).forEach(load => {
    try { load(); } catch { /* ignore */ }
  });
}
