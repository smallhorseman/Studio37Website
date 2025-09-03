import axios from 'axios';
import { API_BASE } from '@/config/env';
import { REMOTE_API_BASE, PROXY_API_BASE, isSameOrigin } from '@/config/env';

const axiosApiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach token to requests if available
axiosApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or get from context/hook
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401/404 errors globally
axiosApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Optional: broadcast logout
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      if (error.response.status === 404) {
        // Optionally handle not found
        // e.g., show a toast or redirect
      }
    }
    return Promise.reject(error);
  }
);

// Example usage:
// axiosApiClient.get('/services') will request https://sem37-api.onrender.com/api/services
// axiosApiClient.get('/packages') will request https://sem37-api.onrender.com/api/packages

export default axiosApiClient;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export { api };

let forceProxy = false;

async function tryFetch(base, path, options) {
  const url = `${base}${path}`;
  return fetch(url, options);
}

async function smartFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // Always try remote first unless previously forced to proxy
  const sequence = forceProxy
    ? [PROXY_API_BASE, REMOTE_API_BASE]
    : [REMOTE_API_BASE, PROXY_API_BASE];

  let lastError;
  for (const base of sequence) {
    // Skip remote if cross-origin & we already forced proxy
    if (base === REMOTE_API_BASE && forceProxy && !isSameOrigin(REMOTE_API_BASE)) continue;
    try {
      const res = await tryFetch(base, path, options);
      // If CORS blocked, status may be 0 (network) or we may miss headers — treat non-accessible as failure
      if (!res) throw new Error('No response object');
      if (!res.ok) {
        // 404 at remote with missing CORS headers also triggers fallback attempt
        if (base === REMOTE_API_BASE && !isSameOrigin(REMOTE_API_BASE) && res.status === 404) {
          // Continue to proxy; store error but don't break
          lastError = new Error(`Remote 404 (possible CORS): ${res.status}`);
          continue;
        }
        return res; // surface non-OK for caller to handle (other than forced fallback)
      }
      // Success
      if (base === PROXY_API_BASE && !isSameOrigin(REMOTE_API_BASE)) {
        forceProxy = true; // persist preference after a proxy success
      }
      return res;
    } catch (e) {
      lastError = e;
      continue;
    }
  }
  throw lastError || new Error('API fetch failed');
}

export const apiClient = {
  async get(path, init = {}) {
    const res = await smartFetch(path, { ...init, method: 'GET', credentials: init.credentials || 'include' });
    return res;
  },
  async post(path, body, init = {}) {
    const res = await smartFetch(path, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      body: JSON.stringify(body),
      credentials: init.credentials || 'include'
    });
    return res;
  }
};

// Helper to parse JSON safely
export async function parseJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

const runningOnTools = (typeof window !== 'undefined') && window.location.hostname.includes('tools.');
if (runningOnTools) {
  axiosApiClient.defaults.baseURL = '/api'; // ensure proxy usage
}

export function enableProxyMode() {
  forceProxy = true;
  if (axiosApiClient) axiosApiClient.defaults.baseURL = '/api';
}

export async function getJson(path) { // NEW helper
  const seq = runningOnTools ? ['/api', ''] : ['', '/api'];
  let lastErr;
  for (const prefix of seq) {
    try {
      const res = await fetch(prefix + path, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!res.ok || !ct.includes('json')) {
        lastErr = new Error(`Bad response ${res.status} ${prefix}${path}`);
        continue;
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error('Failed getJson');
}