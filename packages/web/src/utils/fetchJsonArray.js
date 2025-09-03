import { API_BASE, PROJECTS_ENDPOINT_OVERRIDE, IS_PROD, PACKAGES_ENDPOINT_OVERRIDE, ALLOW_PROD_RELATIVE, SERVICES_ENDPOINT_OVERRIDE } from '@/config/env';

const HTML_SIGNATURE_RE = /<!doctype|<html/i;
const APP_SHELL_HINT_RE = /<div id="root">|vite/i;
const looksLikeHtml = (txt = '') => HTML_SIGNATURE_RE.test(txt.slice(0, 500));
const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';
const FORCE_REL = import.meta.env.VITE_FORCE_RELATIVE_API === '1' || import.meta.env.VITE_API_RELATIVE_ONLY === '1';
// NEW: short-lived cache for repeated 401s (prevents console spam / network hammer)
const RESULT_CACHE = new Map(); // logical -> { ts, status, result }
const UNAUTH_TTL_MS = 4000;

/**
 * Fetch an endpoint that should yield a JSON array (or {results: []}).
 * Returns: { data: array, error: string|null, attempts: [{url,status,classification}] }
 */
const inflight = new Map(); // logical -> Promise

export async function fetchJsonArray(logical, opts = {}) {
  // IN-FLIGHT DE-DUPE
  if (inflight.has(logical)) return inflight.get(logical);

  // NEW: serve cached public 401 (no token) result for a brief TTL to avoid repeated requests
  {
    const cached = RESULT_CACHE.get(logical);
    if (cached && cached.status === 401 && (Date.now() - cached.ts) < UNAUTH_TTL_MS) {
      return cached.result;
    }
  }

  const exec = (async () => {
    const { override, extraCandidates = [] } = opts;
    const attempts = [];

    // FIX: define host + forced relative mode before usage
    const sameHost =
      typeof window !== 'undefined' &&
      window.location &&
      /studio37\.cc$/i.test(window.location.host);

    // Will prefer /api/* relative first when hosting on studio37.cc or env forces it (bypasses CORS on raw API origin)
    const forceRelativeMode = FORCE_REL || sameHost;

    const baseRaw = ((typeof API_BASE !== 'undefined' && API_BASE) || import.meta.env.VITE_API_URL || 'https://sem37-api.onrender.com').trim();
    const base = baseRaw.replace(/\/+$/,'');
    const candidates = new Set();

    // Explicit overrides
    if (override) candidates.add(override);
    if (!override) {
      if (logical === 'projects' && PROJECTS_ENDPOINT_OVERRIDE) candidates.add(PROJECTS_ENDPOINT_OVERRIDE);
      if (logical === 'packages' && PACKAGES_ENDPOINT_OVERRIDE) candidates.add(PACKAGES_ENDPOINT_OVERRIDE);
      if (logical === 'services' && SERVICES_ENDPOINT_OVERRIDE) candidates.add(SERVICES_ENDPOINT_OVERRIDE); // added
    }

    // Core absolute candidates
    const absoluteCandidates = [
      `${base}/api/${logical}`,
      `${base}/api/${logical}/`,
      `${base}/${logical}`,
      `${base}/${logical}/`,
      `${base}/api/v1/${logical}`,
      `${base}/v1/${logical}`,
      `${base}/v1/${logical}/`
    ];

    // Relative (preferred when forcing relative to bypass CORS)
    const relativeCandidates = [
      `/api/${logical}`,
      `/api/${logical}/`
    ];

    if (forceRelativeMode) {
      relativeCandidates.forEach(c => candidates.add(c));
      absoluteCandidates.forEach(c => candidates.add(c));
    } else {
      absoluteCandidates.forEach(c => candidates.add(c));
      if (!IS_PROD || ALLOW_PROD_RELATIVE) {
        relativeCandidates.forEach(c => candidates.add(c));
      }
    }

    // Extra user-provided
    extraCandidates.forEach(c => {
      if (!c) return;
      candidates.add(/^https?:\/\//i.test(c) ? c : `${base}/${c.replace(/^\/+/, '')}`);
    });

    for (const url of candidates) {
      let classification = 'unknown';
      try {
        const token = (() => {
          try { return localStorage.getItem('jwt_token') || localStorage.getItem('token'); } catch { return null; }
        })();
        const res = await fetch(url, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json, text/plain;q=0.4, */*;q=0.1',
            'X-Requested-With': 'XMLHttpRequest',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          mode: 'cors'
        });
        if (API_DEBUG) console.warn('[fetchJsonArray]', logical, url, res.status);

        const status = res.status;
        const ct = (res.headers.get('content-type') || '').toLowerCase();

        // EARLY EXIT ON 401 (avoid endpoint hammering)
        if (status === 401) {
          if (token) {
            classification = 'http_401';
            attempts.push({ url, status, classification });
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:unauthorized'));
            break;
          } else {
            // NEW: public 401 (user not logged in) -> treat as non-fatal empty (cached)
            classification = 'http_401_public';
            attempts.push({ url, status, classification });
            const result = { data: [], error: null, attempts };
            RESULT_CACHE.set(logical, { ts: Date.now(), status, result });
            return result;
          }
        }

        if (!res.ok) {
          classification = `http_${status}`;
          attempts.push({ url, status, classification });
          continue;
        }

        const text = await res.text();

        if (ct.includes('text/html') || looksLikeHtml(text)) {
          classification = APP_SHELL_HINT_RE.test(text) ? 'html_app_shell' : 'html';
          attempts.push({ url, status, classification });
          continue;
        }

        let payload;
        try {
          payload = JSON.parse(text);
        } catch {
            classification = 'json_parse_error';
            attempts.push({ url, status, classification });
            continue;
        }

        if (Array.isArray(payload)) {
          return { data: payload, error: null, attempts };
        }

        if (payload && typeof payload === 'object' && Array.isArray(payload.results)) {
          return { data: payload.results, error: null, attempts };
        }

        classification = 'unexpected_structure';
        attempts.push({ url, status, classification });
      } catch (e) {
        const msg = String(e?.message || '');
        if (/Failed to fetch|CORS|TypeError/i.test(msg)) {
          classification = 'cors_block';
          // If CORS blocked on an absolute URL and we are not yet in forceRelativeMode, enqueue relative first for next iterations
          if (!forceRelativeMode) {
            if (!candidates.has(`/api/${logical}`)) candidates.add(`/api/${logical}`);
            if (!candidates.has(`/api/${logical}/`)) candidates.add(`/api/${logical}/`);
          }
        } else {
          classification = `fetch_error:${e?.message || e}`;
        }
        attempts.push({ url, status: 'n/a', classification });
        // If CORS block, continue trying (relative may succeed)
        continue;
      }
    }

    // NEW: all attempts 404 -> explicit final remote retry (idempotent safeguard)
    const all404 = attempts.length && attempts.every(a => String(a.status).startsWith('404'));
    if (all404) {
      const canonical = `https://sem37-api.onrender.com/api/${logical}`;
      const alreadyTried = attempts.some(a => a.url === canonical);
      if (!alreadyTried) {
        try {
          const token = (() => { try { return localStorage.getItem('jwt_token') || localStorage.getItem('token'); } catch { return null; } })();
          const res = await fetch(canonical, {
            credentials: 'include',
              headers:{
                Accept:'application/json',
                'X-Requested-With':'XMLHttpRequest',
                ...(token ? { Authorization:`Bearer ${token}` } : {})
              }
          });
          const ct = (res.headers.get('content-type')||'').toLowerCase();
          if (res.ok && ct.includes('json')) {
            const j = await res.json();
            if (Array.isArray(j)) return { data:j, error:null, attempts:[...attempts, { url:canonical, status:res.status, classification:'late_retry_ok' }] };
            if (j && typeof j==='object' && Array.isArray(j.results))
              return { data:j.results, error:null, attempts:[...attempts, { url:canonical, status:res.status, classification:'late_retry_ok' }] };
          }
          attempts.push({ url:canonical, status:res.status, classification:`late_retry_${res.status}` });
        } catch (e) {
          attempts.push({ url:canonical, status:'n/a', classification:`late_retry_error:${e?.message||e}` });
        }
      }
    }

    const allCors = attempts.length && attempts.every(a => a.classification === 'cors_block');
    if (allCors) {
      return {
        data: [],
        error: 'CORS blocked all absolute API attempts. Use relative /api proxy (set VITE_FORCE_RELATIVE_API=1) or enable CORS on backend.',
        attempts
      };
    }

    return {
      data: [],
      error: buildHint(logical, attempts),
      attempts
    };
  })().finally(() => {
    inflight.delete(logical);
  });

  inflight.set(logical, exec);
  return exec;
}

function buildHint(logical, attempts) {
  if (!attempts.length) return `No attempts for ${logical}.`;
  const allHtml = attempts.every(a => a.classification.startsWith('html'));
  if (allHtml)
    return `All ${logical} endpoints returned HTML (likely hitting frontend). Provide VITE_${logical.toUpperCase()}_ENDPOINT or correct API_BASE.`;
  if (attempts.some(a => a.classification === 'html_app_shell'))
    return `App shell HTML detected for ${logical}. Remove rewrite to frontend for API paths.`;
  if (attempts.some(a => a.classification.startsWith('http_404')))
    return `${logical} endpoints 404. Verify path or set VITE_${logical.toUpperCase()}_ENDPOINT.`;
  if (attempts.some(a => a.classification.startsWith('fetch_error')))
    return `Network errors fetching ${logical}. Check CORS / connectivity.`;
  return `No valid JSON array for ${logical}.`;
}

function deriveHint(logical, attempts) {
  if (!attempts.length) return 'No requests executed.';
  const htmlShell = attempts.some(a => a.classification === 'html_app_shell');
  if (htmlShell) {
    return 'HTML app shell detected. Ensure external API domain is correct (API_BASE) and not serving the frontend build.';
  }
  const onlyHtml = attempts.every(a => a.classification.startsWith('html'));
  if (onlyHtml) {
    return 'All candidates returned HTML. Likely missing API deployment or wrong base URL.';
  }
  const any404 = attempts.some(a => a.classification === 'http_404');
  if (any404) {
    return 'Some 404 responses. Confirm correct path or set VITE_' + logical.toUpperCase() + '_ENDPOINT.';
  }
  return 'Checked endpoints: ' + attempts.length;
}
