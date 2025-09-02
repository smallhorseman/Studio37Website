export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || 'https://sem37-api.onrender.com/api').replace(/\/+$/, '');

export const AUTH_BASE =
  (import.meta.env.VITE_AUTH_BASE_URL || '/auth').replace(/\/+$/, '');
