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

const API_DEBUG = import.meta?.env?.VITE_API_DEBUG === '1';

function prefixIfNeeded(path) {
  if (path.startsWith('/api/')) return path;
  if (KNOWN_RESOURCE_PREFIXES.some(p => path.startsWith(p))) {
    return '/api' + (path.startsWith('/') ? '' : '/') + path;
  }
  return path;
}

// NEW: generate fallback candidate paths for a logical resource request
function buildPathCandidates(originalPath) {
  const out = [];
  const clean = originalPath.startsWith('/') ? originalPath : '/' + originalPath;

  // First: original as‑is
  out.push(clean);

  // Ensure /api prefix variant
  if (!clean.startsWith('/api/')) out.push('/api' + clean);

  // If already /api/<resource> add cms variant
  const m = clean.match(/^\/api\/([^/]+)(\/.*)?$/);
  if (m) {
    const resource = m[1];
    // Add /api/cms/<resource> only for known content types
    if (['packages','projects','services'].includes(resource)) {
      out.push(`/api/cms/${resource}`);
    }
  } else {
    // If not /api/ maybe it is /packages => add /api/packages
    const seg = clean.split('/')[1];
    if (['packages','projects','services'].includes(seg)) {
      out.push(`/api/${seg}`);
      out.push(`/api/cms/${seg}`);
    }
  }

  // De‑duplicate while keeping order
  return Array.from(new Set(out));
}

// Enhanced smartFetch to try fallback candidates if 404
async function smartFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const primaryNormalized = prefixIfNeeded(path.startsWith('/') ? path : '/' + path);
  const baseOrder = shouldProxyFirst()
    ? [PROXY_API_BASE, REMOTE_API_BASE]
    : [REMOTE_API_BASE, PROXY_API_BASE];

  // Build path candidates (only used after a 404 on first pass)
  const pathCandidates = buildPathCandidates(primaryNormalized);

  let lastError;
  for (const base of baseOrder) {
    // For each base cycle through candidates (first candidate list may include original)
    for (const candidate of pathCandidates) {
      // For remote leg we keep candidate as is (remote may accept raw or prefixed)
      // For proxy leg ensure api-prefixed candidate
      const isProxy = base === PROXY_API_BASE;
      const finalPath = isProxy ? prefixIfNeeded(candidate) : candidate;

      try {
        const res = await tryFetch(base, finalPath, {
          ...options,
            method,
            credentials: options.credentials || 'include'
        });

        if (!res) throw new Error('No response object');

        // If we hit a 404 on first candidate and there are alternates, loop continues
        if (!res.ok) {
          if (API_DEBUG) console.warn('[apiClient] non-OK', { base, path: finalPath, status: res.status });
          // Special: PUT with slug that 404s -> degrade to POST attempt (creation) once
          if (method === 'PUT' && res.status === 404 && /\/packages\/[^/]+$/.test(finalPath)) {
            if (API_DEBUG) console.warn('[apiClient] downgrade PUT->POST for slug not found', finalPath);
            // attempt create immediately (POST) then skip remaining candidates
            try {
              const createRes = await tryFetch(base, finalPath.replace(/\/([^/]+)$/, ''), {
                ...options,
                method: 'POST'
              });
              if (createRes?.ok) {
                if