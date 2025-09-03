import { API_BASE, PROJECTS_ENDPOINT_OVERRIDE, IS_PROD, PACKAGES_ENDPOINT_OVERRIDE, ALLOW_PROD_RELATIVE, SERVICES_ENDPOINT_OVERRIDE } from '@/config/env';

const HTML_SIGNATURE_RE = /<!doctype|<html/i;
const APP_SHELL_HINT_RE = /<div id="root">|vite/i;
const looksLikeHtml = (txt = '') => HTML_SIGNATURE_RE.test(txt.slice(0, 500));
const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';

/**
 * Fetch an endpoint that should yield a JSON array (or {results: []}).
 * Returns: { data: array, error: string|null, attempts: [{url,status,classification}] }
 */
export async function fetchJsonArray(logical, opts = {}) {
  const { override, extraCandidates = [] } = opts;
  const attempts = [];

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
  [
    `${base}/api/${logical}`,
    `${base}/api/${logical}/`,
    `${base}/${logical}`,
    `${base}/${logical}/`,
    `${base}/api/v1/${logical}`,
    `${base}/v1/${logical}`,
    `${base}/v1/${logical}/`
  ].forEach(c => candidates.add(c));

  // Relative fallbacks only in dev OR if explicitly allowed in prod (temporary CORS workaround)
  if (!IS_PROD || ALLOW_PROD_RELATIVE) {
    candidates.add(`/api/${logical}`);
    candidates.add(`/api/${logical}/`);
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
        }
      });
      if (API_DEBUG) console.warn('[fetchJsonArray]', logical, url, res.status);

      const status = res.status;
      const ct = (res.headers.get('content-type') || '').toLowerCase();

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
      classification = `fetch_error:${e?.message || e}`;
      attempts.push({ url, status: 'n/a', classification });
    }
  }

  return {
    data: [],
    error: buildHint(logical, attempts),
    attempts
  };
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
