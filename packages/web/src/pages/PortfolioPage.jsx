import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_BASE } from '@/config/env';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { seedProjects } from '@/data/seedContent'; // NEW fallback import

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);          // always store normalized array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(-1);

  // One‑time HTML response warning limiter
  const htmlWarnedRef = React.useRef(false);

  // Added: optional explicit override via env (VITE_PROJECTS_ENDPOINT)
  const PROJECTS_OVERRIDE = import.meta.env.VITE_PROJECTS_ENDPOINT?.trim();

  // NEW: prefer relative (proxy) endpoints FIRST to avoid repeated cross-origin CORS failures
  const endpointCandidates = useMemo(() => Array.from(new Set([
    '/api/projects',
    '/api/projects/',             // proxy (Netlify) or dev server
    ...(PROJECTS_OVERRIDE ? [PROJECTS_OVERRIDE] : []),
    `${API_BASE}/api/projects`,    // remote variations (may CORS fail)
    `${API_BASE}/projects`,
    `${API_BASE}/projects/`
  ])), [PROJECTS_OVERRIDE]); // NOTE: API_BASE is build-time constant; safe to omit

  const hasFetchedRef = useRef(false);

  const fetchProjects = useCallback(async (opts = { manual: false }) => {
    if (!opts.manual && hasFetchedRef.current) return; // keep initial guard
    hasFetchedRef.current = true;

    setLoading(true);
    setError(null);
    setProjects([]);

    const attemptDetails = [];
    let fetchErrorCount = 0;
    const isHtmlText = (txt = '') => {
      const lower = txt.slice(0, 300).toLowerCase();
      return lower.includes('<!doctype') || lower.includes('<html');
    };

    for (const url of endpointCandidates) {
      let classification = 'unknown';
      // Abort each individual request after 8s
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 8000);
      try {
        // eslint-disable-next-line no-console
        console.debug('[PortfolioPage] attempt', url);
        const res = await fetch(url, {
          credentials: 'include',
          headers: { 'Accept': 'application/json, text/plain;q=0.5, */*;q=0.2' },
          signal: ac.signal
        });
        clearTimeout(timer);

        const status = res.status;
        const ct = (res.headers.get('content-type') || '').toLowerCase();

        if (!res.ok) {
          classification = `http_${status}`;
          attemptDetails.push({ url, status, classification });
          continue;
        }

        if (ct.includes('text/html')) {
          if (!htmlWarnedRef.current) {
            // eslint-disable-next-line no-console
            console.warn(`[PortfolioPage] HTML content-type from ${url}`);
            htmlWarnedRef.current = true;
          }
          classification = 'html_content_type';
          attemptDetails.push({ url, status, classification });
          continue;
        }

        let bodyText;
        try {
          bodyText = await res.text();
        } catch {
          classification = 'body_read_failed';
          attemptDetails.push({ url, status, classification });
          continue;
        }

        if (isHtmlText(bodyText)) {
          if (!htmlWarnedRef.current) {
            // eslint-disable-next-line no-console
            console.warn(`[PortfolioPage] HTML snippet detected in response from ${url}`);
            htmlWarnedRef.current = true;
          }
          classification = 'html_snippet';
          attemptDetails.push({ url, status, classification });
          continue;
        }

        let data;
        try {
          data = JSON.parse(bodyText);
        } catch {
          classification = 'invalid_json';
          attemptDetails.push({ url, status, classification });
          continue;
        }

        if (Array.isArray(data)) {
          setProjects(data);
          setLoading(false);
          return;
        }
        if (data && typeof data === 'object' && Array.isArray(data.results)) {
          setProjects(data.results);
          setLoading(false);
          return;
        }

        classification = 'unexpected_structure';
        attemptDetails.push({ url, status, classification });
      } catch (e) {
        clearTimeout(timer);
        classification = (e?.name === 'AbortError')
          ? 'timeout_abort'
          : `fetch_error:${e?.message || e}`;
        attemptDetails.push({ url, status: 'n/a', classification });
        fetchErrorCount += 1;

        // EARLY BREAK: after 2 network/cors style failures, use seed to avoid endless remote attempts
        if (fetchErrorCount >= 2) {
          break;
        }
        continue;
      }
    }

    // Seed fallback (unchanged logic, moved slightly earlier if early-break)
    if (Array.isArray(seedProjects) && seedProjects.length) {
      // eslint-disable-next-line no-console
      console.warn('[PortfolioPage] Using seedProjects fallback (remote attempts failed / CORS).');
      setProjects(seedProjects);
      setLoading(false);
      return;
    }

    setError(
      `Projects unavailable. Attempts: ` +
      attemptDetails.map(a => `[${a.classification}@${a.url}]`).join(' ')
    );
    setLoading(false);
  }, [endpointCandidates]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Normalized list used everywhere below
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Lightbox slides derived from normalized list
  const slides = safeProjects.map(p => ({
    src: p?.imageUrl || '',
    alt: p?.name || 'Project'
  }));

  if (loading) return <div className="py-24 sm:py-32">Loading portfolio...</div>;
  if (error) return (
    <div className="py-24 sm:py-32 text-red-500 space-y-4">
      <div>Error: {error}</div>
      <div className="text-xs text-gray-500">
        Set VITE_PROJECTS_ENDPOINT to a known JSON array endpoint (e.g. https://api.example.com/api/projects)
      </div>
      <button
        onClick={() => fetchProjects({ manual: true })} // changed
        className="px-4 py-2 border rounded text-sm hover:bg-red-50"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">
              A Glimpse Into Our Gallery
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Every photo tells a story. Click on any image to view it in full detail.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {safeProjects.map((project, idx) => (
            <div
              key={project?.id ?? idx}
              onClick={() => setIndex(idx)}
              className="cursor-pointer"
            >
              <PolaroidImage
                src={project?.imageUrl || ''}
                alt={project?.name || 'Project'}
                caption={project?.name || 'Untitled'}
              />
            </div>
          ))}
          {safeProjects.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No portfolio items available.
            </div>
          )}
        </div>

        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={slides}
        />
      </div>
    </div>
  );
}