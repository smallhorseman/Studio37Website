const trim = (v = '') => v.replace(/\/+$/, '');

export const API_BASE =
  trim(import.meta.env.VITE_API_BASE_URL || 'https://sem37-api.onrender.com');

export const REMOTE_API_BASE = API_BASE;
export const PROXY_API_BASE = '/api';

export const REMOTE_AUTH_BASE =
  trim(import.meta.env.VITE_AUTH_BASE_URL || 'https://auth-3778.onrender.com');
export const PROXY_AUTH_BASE = '/auth';

export const isSameOrigin = (urlStr) => {
  try {
    return new URL(urlStr, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
};

export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined'
  ? __BUILD_TIME__
  : new Date().toISOString();

// Paths that often get called without /api prefix - we retry through proxy if 404 / CORS
export const API_COMMON_PATHS = ['/services', '/cms/posts', '/packages'];

export const FORCE_API_PROXY =
  (import.meta.env.VITE_FORCE_API_PROXY === '1' ||
   import.meta.env.VITE_FORCE_API_PROXY === 'true');

export const API_HOST = (() => {
  try { return new URL(API_BASE).host; } catch { return ''; }
})();
export const IS_PROD = import.meta.env.PROD;
// Optional explicit overrides
export const PROJECTS_ENDPOINT_OVERRIDE = import.meta.env.VITE_PROJECTS_ENDPOINT?.trim() || '';
export const PACKAGES_ENDPOINT_OVERRIDE = import.meta.env.VITE_PACKAGES_ENDPOINT?.trim() || '';
export const ALLOW_PROD_RELATIVE = !!import.meta.env.VITE_ALLOW_PROD_RELATIVE;
