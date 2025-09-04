// Centralized environment & fallback constants

export const IS_PROD = import.meta.env.PROD;

// Core API base (trim trailing slash)
export const API_BASE = (import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com').replace(/\/+$/, '');

// Optional explicit overrides (empty string means: not set)
export const PROJECTS_ENDPOINT_OVERRIDE = import.meta.env.VITE_PROJECTS_ENDPOINT || '';
export const PACKAGES_ENDPOINT_OVERRIDE = import.meta.env.VITE_PACKAGES_ENDPOINT || '';
export const SERVICES_ENDPOINT_OVERRIDE = import.meta.env.VITE_SERVICES_ENDPOINT || '';

// Allow relative /api fallback in production (string '1' => true)
export const ALLOW_PROD_RELATIVE = (import.meta.env.VITE_ALLOW_PROD_RELATIVE || '0') === '1';

// Expose a simple build timestamp
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();

// Paths that often get called without /api prefix - we retry through proxy if 404 / CORS
export const API_COMMON_PATHS = ['/services', '/cms/posts', '/packages', '/projects'];

// Force using proxy even if absolute URL
export const FORCE_API_PROXY =
  (import.meta.env.VITE_FORCE_API_PROXY === '1' ||
   import.meta.env.VITE_FORCE_API_PROXY === 'true');

// Derived host for CORS checks
export const API_HOST = (() => {
  try { return new URL(API_BASE).host; } catch { return ''; }
})();
