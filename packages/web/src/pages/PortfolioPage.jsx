import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);          // always store normalized array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(-1);

  // One‑time HTML response warning limiter
  const htmlWarnedRef = React.useRef(false);
  const lastTriedRef = React.useRef(null);

  // Candidate endpoints (ordered). Adjust/remove those not relevant to your backend.
  const PROJECT_ENDPOINT_CANDIDATES = [
    '/api/projects',
    '/api/projects/',
    '/api/public/projects',
    '/projects',
    '/projects/',
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProjects([]);
    let found = false;
    let lastErrMsg = 'No valid project endpoint responded with JSON.';
    for (const ep of PROJECT_ENDPOINT_CANDIDATES) {
      lastTriedRef.current = ep;
      try {
        const response = await apiClient.get(ep, { validateStatus: () => true });
        const ct = (response.headers?.['content-type'] || '').toLowerCase();
        const payload = response.data;

        // Reject HTML or unexpected content-type
        if (ct.includes('text/html') || (typeof payload === 'string' && payload.toLowerCase().includes('<!doctype'))) {
          if (!htmlWarnedRef.current) {
            // eslint-disable-next-line no-console
            console.warn(`[PortfolioPage] Endpoint ${ep} returned HTML (likely SPA index).`);
            htmlWarnedRef.current = true;
          }
          lastErrMsg = `Endpoint ${ep} returned HTML instead of JSON.`;
          continue; // try next endpoint
        }

        // Accept array directly
        if (Array.isArray(payload)) {
          setProjects(payload);
          found = true;
          break;
        }

        // Accept wrapped results array
        if (payload && typeof payload === 'object' && Array.isArray(payload.results)) {
            setProjects(payload.results);
            found = true;
            break;
        }

        lastErrMsg = `Endpoint ${ep} responded but payload was not an array.`;
      } catch (e) {
        lastErrMsg = `Fetch failed for ${ep}: ${e.message || e}`;
        continue;
      }
    }

    if (!found) {
      setError(lastErrMsg);
    }
    setLoading(false);
  }, []);

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
    <div className="py-24 sm:py-32 text-red-500">
      Error: {error}
      <div className="mt-4">
        <button
          onClick={fetchProjects}
          className="px-4 py-2 border rounded text-sm hover:bg-red-50"
        >
          Retry
        </button>
      </div>
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