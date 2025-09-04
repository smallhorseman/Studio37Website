import React, { useEffect, useState, useCallback } from 'react';
import { seedProjects } from '@/data/seedContent';
import { fetchJsonArray } from '@/utils/fetchJsonArray';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setNote(null);
    const { data, error } = await fetchJsonArray('projects');

    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects(seedProjects);
      setNote('Using seed projects (API unavailable or no projects found).');
      if (error) {
        console.warn('[PortfolioPage] API fetch error, using seed:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (loading) return <div className="py-24 sm:py-32 text-center">Loading portfolio...</div>;

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">
              A Glimpse Into Our Gallery
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Every photo tells a story.
            </p>
          </div>
        </FadeIn>
        {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded inline-block mt-4">{note}</div>}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {projects.map((p,i) => (
            <div key={p.id || i}>
              <PolaroidImage
                src={p.imageUrl || ''}
                alt={p.name || 'Project'}
                caption={p.name || 'Untitled'}
              />
            </div>
          ))}
          {!projects.length && (
            <div className="col-span-full text-center text-gray-500">
              No portfolio items available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}