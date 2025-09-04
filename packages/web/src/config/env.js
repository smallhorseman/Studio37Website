// Centralized environment & fallback constants

export const IS_PROD = import.meta.env.PROD;

// Core API base (trim trailing slash)
export const API_BASE = (import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com').replace(/\/+$/, '');

// Remote and proxy API bases
export const REMOTE_API_BASE = API_BASE;
export const PROXY_API_BASE = '/api';

// Helper function to determine if a URL is same origin
export function isSameOrigin() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return /studio37\.cc$/i.test(host) || host === 'localhost' || host.includes('192.168.');
}

// Optional explicit overrides (empty string means: not set)
export const PROJECTS_ENDPOINT_OVERRIDE = import.meta.env.VITE_PROJECTS_ENDPOINT || '';
export const PACKAGES_ENDPOINT_OVERRIDE = import.meta.env.VITE_PACKAGES_ENDPOINT || '';
export const SERVICES_ENDPOINT_OVERRIDE = import.meta.env.VITE_SERVICES_ENDPOINT || '';

// Allow relative /api fallback in production (string '1' => true)
export const ALLOW_PROD_RELATIVE = (import.meta.env.VITE_ALLOW_PROD_RELATIVE || '0') === '1';

// Expose a simple build timestamp
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();
