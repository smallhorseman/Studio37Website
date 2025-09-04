import React, { useEffect, useState } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray.js';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [note, setNote] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await fetchJsonArray('projects');
      if (!active) return;
      if (data?.length) {
        setProjects(data);
      } else {
        setProjects([]);
        setNote(error ? 'No projects (API unreachable or empty).' : 'No projects available.');
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold">Portfolio</h1>
      {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded">{note}</div>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <div key={p.id || p.title} className="border rounded p-4 bg-white shadow-sm">
            <h2 className="font-semibold">{p.title || 'Untitled Project'}</h2>
            {p.description && <p className="text-sm mt-2 text-gray-600">{p.description}</p>}
          </div>
        ))}
        {!projects.length && !note && (
          <div className="col-span-full text-gray-400 text-sm">Loading...</div>
        )}
      </div>
    </div>
  );
}