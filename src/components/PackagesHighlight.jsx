// src/components/PackagesHighlight.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PackagesHighlight() {
  return (
    <section className="text-center py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Packages</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        Simple, transparent pricing to fit your needs, from a quick session to a full-day event.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-2">Mini Reel</h3>
          <p className="text-4xl font-bold my-2">$75</p>
          <p>A 15-minute session perfect for a quick update or single look.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-2">Feature Film</h3>
          <p className="text-4xl font-bold my-2">$150</p>
          <p>Our most popular 30-minute session, ideal for small families or couples.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-2">Epic Saga</h3>
          <p className="text-4xl font-bold my-2">$275</p>
          <p>A full hour session for multiple looks, locations, or larger groups.</p>
        </div>
      </div>
      <Link to="/packages" className="btn-polaroid">View All Packages</Link>
    </section>
  );
}

export default PackagesHighlight;