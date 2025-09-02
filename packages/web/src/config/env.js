const trim = (v = '') => v.replace(/\/+$/, '');

export const API_BASE =
  trim(import.meta.env.VITE_API_BASE_URL || 'https://sem37-api.onrender.com');

export const AUTH_BASE =
  trim(import.meta.env.VITE_AUTH_BASE_URL || 'https://auth-3778.onrender.com');

export const LOGIN_URL = `${AUTH_BASE}/login`;
export const LOGOUT_URL = `${AUTH_BASE}/logout`;

export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();
