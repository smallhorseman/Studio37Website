import { API_BASE, PROJECTS_ENDPOINT_OVERRIDE } from '@/config/env';

/**
 * Tries to fetch JSON array data from a path (with or without leading /api).
 * Returns { data: array, error: string | null, attempts: [] }
 */
export async function fetchJsonArray(logical, opts = {}) {
  const { override, extraCandidates = [] } = opts;
  const attempts = [];

  const buildCandidates = () => {
    const list = new Set();

    // 1. Explicit override (env or caller)
    if (override) list.add(override);
    // 2. Specific env override for projects if logical matches
    if (!override && logical === 'projects' && PROJECTS_ENDPOINT_OVERRIDE) {
      list.add(PROJECTS_ENDPOINT_OVERRIDE);
    }

    const base = API_BASE.replace(/\/+$/, '');

    // 3. Common plural / singular / versioned candidates
    const bases = [base];
    const roots = [
      logical,
      `${logical}/`,
      `${logical}s`,
      `${logical}s/`
    ];

    const versioned = [
      `api/${logical}`,
      `api/${logical}/`,
      `api/${logical}s`,
      `api/${logical}s/`,
      `api/v1/${logical}`,
      `api/v1/${logical}/`,
      `v1/${logical}`,
      `v1/${logical}/`
    ];

    [...roots, ...versioned].forEach(p => bases.forEach(b => list.add(`${b}/${p}`)));

    // Allow consumer provided extras
    extraCandidates.forEach(c => {
      if (c.startsWith('http')) list.add(c);
      else list.add(`${base}/${c.replace(/^\/+/, '')}`);
    });

    return Array.from(list);
  };

  const candidates = buildCandidates();

  const HTML_SIGNATURE_RE = /<!doctype|<html/i;
  const APP_SHELL_HINT_RE = /<div id="root">|vite/i;

  function looksLikeHtml(txt = '') {
    return HTML_SIGNATURE_RE.test(txt.slice(0, 500));
  }

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
      const ctype = (res.headers.get('content-type') || '').toLowerCase();

      if (!res.ok) {
        classification = `http_${status}`;
        attempts.push({ url, status, classification });
        continue;
      }

      const text = await res.text();

      if (ctype.includes('text/html') || looksLikeHtml(text)) {
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
