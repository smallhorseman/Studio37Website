// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-background text-white flex items-center justify-center text-center rounded-b-3xl overflow-hidden shadow-2xl relative">
      <div className="container mx-auto px-6 py-20 relative z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-xl">Studio 37</h1>
        <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto font-medium italic drop-shadow-lg">
          life's a movie, let us capture your highlight reel
        </p>
        <Link to="/contact" className="btn-polaroid">Book Your Session</Link>
      </div>
      {/* This div creates the dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </section>
  );
}

export default Hero;