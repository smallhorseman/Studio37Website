// src/pages/PackagesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PackagesPage() {
  return (
    <main className="py-20 md:py-24">
      <section id="packages" className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-10 text-center">Our Portrait Packages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Mini Reel</h3>
            <p className="text-6xl font-bold text-gray-900 mb-4">$75</p>
            <p className="text-xl font-semibold text-gray-700 mb-3">15 Minutes</p>
            <p className="text-lg text-gray-600 mb-6">Includes 15 professionally edited digital photos</p>
            <p className="text-gray-500 text-base italic">PLUS: 1 Free Polaroid Print</p>
            <Link to="/contact" className="btn-polaroid mt-6">Book Mini Reel</Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Feature Film</h3>
            <p className="text-6xl font-bold text-gray-900 mb-4">$150</p>
            <p className="text-xl font-semibold text-gray-700 mb-3">30 Minutes</p>
            <p className="text-lg text-gray-600 mb-6">Includes 30 professionally edited digital photos</p>
            <p className="text-gray-500 text-base italic">PLUS: 1 Free Polaroid Print</p>
            <Link to="/contact" className="btn-polaroid mt-6">Book Feature Film</Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Epic Saga</h3>
            <p className="text-6xl font-bold text-gray-900 mb-4">$275</p>
            <p className="text-xl font-semibold text-gray-700 mb-3">60 Minutes</p>
            <p className="text-lg text-gray-600 mb-6">Includes 60 professionally edited digital photos</p>
            <p className="text-gray-500 text-base italic">PLUS: 1 Free Polaroid Print</p>
            <Link to="/contact" className="btn-polaroid mt-6">Book Epic Saga</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PackagesPage;