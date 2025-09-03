import { API_BASE } from '@/config/env';

/**
 * Tries to fetch JSON array data from a path (with or without leading /api).
 * Returns { data: array, error: string | null, attempts: [] }
 */
export async function fetchJsonArray(rawPath) {
  const path = rawPath.startsWith('http') ? rawPath : rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const candidates = [];

  // If already absolute
  if (/^https?:\/\//i.test(path)) {
    candidates.push(path);
  } else {
    // Ensure API_BASE prefixed candidates
    const trimmed = path.replace(/^\/+/, '');
    // Prefer /api/<trimmed> then <trimmed>
    if (!trimmed.startsWith('api/')) candidates.push(`${API_BASE}/api/${trimmed}`);
    candidates.push(`${API_BASE}/${trimmed}`);
  }

  const attempts = [];
  const isHtml = (txt) => {
    const lower = txt.slice(0, 400).toLowerCase();
    return lower.includes('<!doctype') || lower.includes('<html');
  };

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: { Accept: 'application/json, text/plain;q=0.5, */*;q=0.2' }
      });
      const status = res.status;
      const ct = (res.headers.get('content-type') || '').toLowerCase();

      if (!res.ok) {
        attempts.push({ url, status, note: 'non_ok' });
        continue;
      }

      const text = await res.text();

      if (ct.includes('text/html') || isHtml(text)) {
        attempts.push({ url, status, note: 'html' });
        continue;
      }

      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        attempts.push({ url, status, note: 'json_parse_fail' });
        continue;
      }

      if (Array.isArray(payload)) {
        return { data: payload, error: null, attempts };
      }
      if (payload && typeof payload === 'object' && Array.isArray(payload.results)) {
        return { data: payload.results, error: null, attempts };
      }

      attempts.push({ url, status, note: 'unexpected_structure' });
    } catch (e) {
      attempts.push({ url, status: 'n/a', note: `fetch_error:${e.message || e}` });
    }
  }

  return {
    data: [],
    error: 'No valid JSON array response',
    attempts
  };
}
