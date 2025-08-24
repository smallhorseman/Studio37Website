// src/components/ServicesHighlight.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ServicesHighlight() {
  return (
    <section className="text-center py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Photography Services</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        We specialize in capturing authentic moments across a wide range of styles and needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Each item is a Link to a future services page section */}
        <Link to="/services#portraits" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2">Portraits</h3>
          <p>Timeless photos for individuals, couples, and families that capture personality and connection.</p>
        </Link>
        <Link to="/services#events" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2">Events</h3>
          <p>Comprehensive coverage for weddings, religious ceremonies, and corporate gatherings.</p>
        </Link>
        <Link to="/services#art" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2">Art</h3>
          <p>Professional, gallery-quality photography for artists to showcase their work and build their brand.</p>
        </Link>
        <Link to="/services#professional" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2">Professional</h3>
          <p>High-impact imagery for real estate, commercial content, and small business branding.</p>
        </Link>
      </div>
      <Link to="/services" className="btn-polaroid">Explore All Services</Link>
    </section>
  );
}

export default ServicesHighlight;