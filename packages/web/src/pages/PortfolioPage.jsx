import React, { useEffect, useState } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray.js';
import PortfolioAccessForm from '@/components/PortfolioAccessForm';
import { motion } from 'framer-motion';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [note, setNote] = useState(null);
  const [showAccessForm, setShowAccessForm] = useState(false);

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

  const handleAccessClick = () => {
    setShowAccessForm(true);
  };

  const handleCloseAccessForm = () => {
    setShowAccessForm(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold">Portfolio</h1>
      
      {/* Portfolio Highlights */}
      <div className="mb-12">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-medium mb-4">Featured Works</h2>
            {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded">{note}</div>}
            <div className="grid gap-6 sm:grid-cols-2">
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
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Full Portfolio Access</h2>
            <p className="text-gray-600 mb-4">
              Our complete portfolio showcases our best work across portrait, event, and product photography.
            </p>
            <p className="text-gray-600 mb-6">
              Get access to our password-protected portfolio and receive a special 10% discount on your first booking.
            </p>
            <button 
              onClick={handleAccessClick}
              className="bg-faded-teal hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Get Access
            </button>
          </div>
        </div>
      </div>
      
      {/* Access Form Modal */}
      {showAccessForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
          >
            <PortfolioAccessForm onClose={handleCloseAccessForm} />
          </motion.div>
        </div>
      )}
    </div>
  );
}