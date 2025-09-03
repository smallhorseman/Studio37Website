import axios from 'axios';
import { API_BASE } from '@/config/env';
import { REMOTE_API_BASE, PROXY_API_BASE, isSameOrigin } from '@/config/env';

const runningOnTools = (typeof window !== 'undefined') && window.location.hostname.includes('tools.');
const KNOWN_RESOURCE_PREFIXES = ['/services','/packages','/projects','/cms/posts','/crm','/tasks'];
let forceProxy = false;

// NEW: decide if remote is cross-origin
const remoteIsCross = (() => {
  try { return !isSameOrigin(REMOTE_API_BASE); } catch { return true; }
})();

// PRIMARY AXIOS CLIENT
const axiosApiClient = axios.create({
  baseURL: runningOnTools ? '/api' : API_BASE,
  timeout: 15000,
});

// Inject token + auto /api prefix
axiosApiClient.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token'); // CHANGED
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  if (cfg.url) {
    if (
      KNOWN_RESOURCE_PREFIXES.some(p => cfg.url.startsWith(p)) &&
      !cfg.url.startsWith('/api/')
    ) {
      cfg.url = '/api' + (cfg.url.startsWith('/') ? '' : '/') + cfg.url;
    }
  }
  return cfg;
});

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

// SECONDARY (legacy) axios instance kept but aligned
const api = axios.create({
  baseURL: runningOnTools ? '/api' : API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token'); // CHANGED
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  if (cfg.url) {
    if (
      KNOWN_RESOURCE_PREFIXES.some(p => cfg.url.startsWith(p)) &&
      !cfg.url.startsWith('/api/')
    ) {
      cfg.url = '/api' + (cfg.url.startsWith('/') ? '' : '/') + cfg.url;
    }
  }
  return cfg;
});

// EXPORT main axios client
export default axiosApiClient;
export { api };

// --- SMART FETCH LAYER (fetch-based) ---

function prefixIfNeeded(path) {
  if (path.startsWith('/api/')) return path;
  if (KNOWN_RESOURCE_PREFIXES.some(p => path.startsWith(p))) {
    return '/api' + (path.startsWith('/') ? '' : '/') + path;
  }
  return path;
}

async function tryFetch(base, path, options) {
  const url = base + path;
  return fetch(url, options);
}

function shouldProxyFirst() {
  // Proxy first when tools subdomain, forced, or remote is cross-origin
  return runningOnTools || forceProxy || remoteIsCross;
}

async function smartFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  // Always normalize path for proxy attempt
  const normalized = prefixIfNeeded(path.startsWith('/') ? path : '/' + path);

  const sequence = shouldProxyFirst()
    ? [PROXY_API_BASE, REMOTE_API_BASE]
    : [REMOTE_API_BASE, PROXY_API_BASE];

  let lastError;
  for (const base of sequence) {
    const isProxy = base === PROXY_API_BASE;
    const finalPath = isProxy ? normalized : path; // only prefix for proxy leg
    try {
      const res = await tryFetch(base, finalPath, {
        ...options,
        method,
        credentials: options.credentials || 'include'
      });
      if (!res) throw new Error('No response object');
      if (!res.ok) {
        // Continue to next strategy on 404 / CORS-like remote
        if (!isProxy && remoteIsCross && (res.status === 404 || res.status === 403)) {
          lastError = new Error(`Remote ${res.status}`);
          continue;
        }
        // Return non-OK to caller (proxy errors surfaced)
        return res;
      }
      if (isProxy) forceProxy = true; // lock future ordering
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
    const res = await smartFetch(path, { ...init, method: 'GET' });
    return res;
  },
  async post(path, body, init = {}) {
    const res = await smartFetch(path, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      body: JSON.stringify(body)
    });
    return res;
  }
};

// Helper to parse JSON safely
export async function parseJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export function enableProxyMode() {
  forceProxy = true;
  try { axiosApiClient.defaults.baseURL = '/api'; } catch { /* ignore */ }
  try { api.defaults.baseURL = '/api'; } catch { /* ignore */ }
}

// NEW: hard force everything through proxy immediately (can be called after first successful proxy call)
export function forceProxyAll() {
  enableProxyMode();
}

// getJson helper updated to reuse prefix logic
export async function getJson(path) {
  const candidates = shouldProxyFirst()
    ? [prefixIfNeeded(path), path]
    : [path, prefixIfNeeded(path)];
  let lastErr;
  for (const p of candidates) {
    try {
      const res = await fetch(p, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!res.ok || !ct.includes('json')) {
        lastErr = new Error(`Bad response ${res.status} ${p}`);
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