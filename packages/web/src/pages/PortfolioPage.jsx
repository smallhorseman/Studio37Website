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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/projects');
      const payload = response?.data;

      // If backend sent HTML (likely CORS / 404 fallback), treat as error
      if (typeof payload === 'string' && payload.toLowerCase().includes('<!doctype')) {
        console.warn('[PortfolioPage] Received HTML instead of JSON array for /projects');
        setProjects([]);
        setError('Unexpected response format from server.');
        return;
      }

      if (Array.isArray(payload)) {
        setProjects(payload);
      } else if (payload && typeof payload === 'object' && Array.isArray(payload.results)) {
        // If API wraps results
        setProjects(payload.results);
      } else {
        console.warn('[PortfolioPage] Non-array payload:', payload);
        setProjects([]);
        setError('Projects data unavailable.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
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