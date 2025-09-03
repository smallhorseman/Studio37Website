import { API_BASE, PROJECTS_ENDPOINT_OVERRIDE, IS_PROD } from '@/config/env';

const HTML_SIGNATURE_RE = /<!doctype|<html/i;
const APP_SHELL_HINT_RE = /<div id="root">|vite/i;
const looksLikeHtml = (txt='') => HTML_SIGNATURE_RE.test(txt.slice(0,500));

/**
 * Tries to fetch JSON array data from a path (with or without leading /api).
 * Returns { data: array, error: string | null, attempts: [] }
 */
export async function fetchJsonArray(logical, opts = {}) {
  const { override, extraCandidates = [] } = opts;
  const attempts = [];

  const base = API_BASE.replace(/\/+$/, '');
  const candidates = new Set();

  // Explicit override(s)
  if (override) candidates.add(override);
  if (!override && logical === 'projects' && PROJECTS_ENDPOINT_OVERRIDE)
    candidates.add(PROJECTS_ENDPOINT_OVERRIDE);

  // Core absolute candidates
  const core = [
    `${base}/api/${logical}`,
    `${base}/api/${logical}/`,
    `${base}/${logical}`,
    `${base}/${logical}/`,
    `${base}/api/v1/${logical}`,
    `${base}/v1/${logical}`
  ];
  core.forEach(c => candidates.add(c));

  // Only add relative fallbacks in DEV (Netlify prod has no proxy; would return HTML)
  if (!IS_PROD) {
    candidates.add(`/api/${logical}`);
    candidates.add(`/api/${logical}/`);
  }

  extraCandidates.forEach(c => {
    if (c) candidates.add(/^https?:\/\//i.test(c) ? c : `${base}/${c.replace(/^\/+/,'')}`);
  });

  for (const url of candidates) {
    let classification = 'unknown';
    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain;q=0.4, */*;q=0.1',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
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
      try { payload = JSON.parse(text); }
      catch {
        classification = 'json_parse_error';
        attempts.push({ url, status, classification });
        continue;
      }

      if (Array.isArray(payload))
        return { data: payload, error: null, attempts };

      if (payload && typeof payload === 'object' && Array.isArray(payload.results))
        return { data: payload.results, error: null, attempts };

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
  if (attempts.every(a => a.classification.startsWith('html')))
    return `All ${logical} endpoints returned HTML (likely hitting frontend). Use absolute API URL or set VITE_${logical.toUpperCase()}_ENDPOINT.`;
  if (attempts.some(a => a.classification === 'html_app_shell'))
    return `App shell HTML detected. Remove client rewrite to /api or configure Netlify proxy.`;
  if (attempts.some(a => a.classification.startsWith('http_404')))
    return `404s encountered. Verify resource path or provide VITE_${logical.toUpperCase()}_ENDPOINT.`;
  return `No valid JSON array (${logical}).`;
}
      classification = `fetch_error:${e?.message || e}`;
      attempts.push({ url, status: 'n/a', classification });
    }
  }

  const hint = deriveHint(logical, attempts);
  return {
    data: [],
    error: `No valid JSON array response (${logical}). ${hint}`,
    attempts
  };
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
