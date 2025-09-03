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

export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();
