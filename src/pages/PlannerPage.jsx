// src/pages/PlannerPage.jsx
import React, { useState } from 'react';

function PlannerPage() {
  const [photoType, setPhotoType] = useState('');
  const [vibe, setVibe] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [plan, setPlan] = useState('');
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateIdeas = async (e) => {
    e.preventDefault();
    setIsLoadingIdeas(true);
    setIdeas([]);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoType, vibe }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate ideas.');
      }
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleGeneratePlan = async (idea) => {
    setIsLoadingPlan(true);
    setPlan('');
    setError('');
    try {
      const response = await fetch('/.netlify/functions/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate a plan.');
      }
      const data = await response.json();
      setPlan(data.plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-16">
      <section className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">AI Photoshoot Planner</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unleash your creativity. Describe your desired photoshoot, and let our AI generate unique ideas and a detailed execution plan for you.
        </p>
      </section>

      <section className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border mb-12">
        <form id="idea-form" onSubmit={handleGenerateIdeas}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="photo-type" className="block text-gray-700 font-medium mb-2">Type of Photoshoot</label>
              <input
                type="text"
                id="photo-type"
                value={photoType}
                onChange={(e) => setPhotoType(e.target.value)}
                placeholder="e.g., Family portrait, solo travel, couple"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="vibe" className="block text-gray-700 font-medium mb-2">Desired Vibe / Mood</label>
              <input
                type="text"
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g., Moody, vibrant, minimalist, vintage"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn-polaroid" disabled={isLoadingIdeas}>
              {isLoadingIdeas ? 'Generating...' : 'Generate Ideas'}
            </button>
          </div>
        </form>
      </section>

      {error && <p className="text-center text-red-500">{error}</p>}

      {isLoadingIdeas && <div className="loader mx-auto my-8"></div>}

      {ideas.length > 0 && (
        <section id="ideas-output" className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">Choose an Idea</h2>
          <div id="ideas-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <div key={index} className="idea-card">
                <p>{idea}</p>
                <button onClick={() => handleGeneratePlan(idea)} className="btn-primary mt-4 w-full">
                  Generate Plan
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {isLoadingPlan && <div className="loader mx-auto my-8"></div>}
      
      {plan && (
        <section id="plan-output" className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-3xl font-bold text-center mb-6">Your Photoshoot Plan</h2>
          <div id="plan-container" className="prose max-w-none" dangerouslySetInnerHTML={{ __html: plan }}></div>
        </section>
      )}
    </main>
  );
}

export default PlannerPage;
