import React, { useEffect, useState } from 'react';
import { seedProjects } from '@/data/seedContent';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

export default function PortfolioPage() {
  const [projects,setProjects] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const endpoints = ['/api/projects','/projects'];
      let data = null;
      for (const u of endpoints) {
        try {
          const r = await fetch(u, { credentials:'include', headers:{Accept:'application/json'} });
          const ct = (r.headers.get('content-type')||'').toLowerCase();
          if (!r.ok || !ct.includes('json')) continue;
          const j = await r.json();
          if (Array.isArray(j)) { data = j; break; }
          if (j && Array.isArray(j.results)) { data = j.results; break; }
        } catch { continue; }
      }
      if (!data) data = seedProjects;
      setProjects(Array.isArray(data)?data:[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="py-24 sm:py-32">Loading portfolio...</div>;

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