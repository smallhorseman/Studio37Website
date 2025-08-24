// src/components/PortfolioUnlock.jsx
import React from 'react';

function PortfolioUnlock() {
  return (
    <section className="text-center py-16 bg-neutral-100 rounded-2xl my-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Unlock Our Portfolio</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        See our complete, categorized portfolio and get a special offer for taking a look.
      </p>
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl border">
        <h3 className="text-3xl font-bold text-gray-800 mb-3">View Our Full Gallery</h3>
        <p className="text-gray-600 mb-6">
          Enter your details to see our complete portfolio and receive a <strong className="text-amber-500">10% OFF coupon</strong> for your first session!
        </p>
        <form id="portfolio-unlock-form" className="space-y-4">
          <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="email" name="email" placeholder="Your Email Address" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <button type="submit" className="btn-polaroid w-full">Unlock Now & Get Coupon</button>
        </form>
      </div>
    </section>
  );
}

export default PortfolioUnlock;