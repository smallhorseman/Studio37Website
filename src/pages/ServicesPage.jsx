// src/pages/ServicesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ServicesPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We provide a comprehensive range of photography services tailored to your personal and professional needs. Click any category to learn more.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/services/portraits" id="portraits" className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Portraits</h2>
          <p className="text-gray-700 mb-4">Capturing the essence of individuals, couples, and families with timeless, expressive photos.</p>
          <span className="font-bold text-amber-600">Learn More &rarr;</span>
        </Link>
        <Link to="/services/events" id="events" className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Events</h2>
          <p className="text-gray-700 mb-4">Comprehensive and discreet coverage for weddings, religious ceremonies, and corporate gatherings.</p>
          <span className="font-bold text-amber-600">Learn More &rarr;</span>
        </Link>
        <Link to="/services/art" id="art" className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Art</h2>
          <p className="text-gray-700 mb-4">Professional, gallery-quality photography for artists to showcase their work and build their brand.</p>
          <span className="font-bold text-amber-600">Learn More &rarr;</span>
        </Link>
        <Link to="/services/professional" id="professional" className="block bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Professional</h2>
          <p className="text-gray-700 mb-4">High-impact imagery for real estate, commercial content, and small business branding.</p>
          <span className="font-bold text-amber-600">Learn More &rarr;</span>
        </Link>
      </div>
    </main>
  );
}

export default ServicesPage;