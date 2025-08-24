// src/pages/BlogPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function BlogPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Studio 37 Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert tips, client stories, and creative inspiration to help you get the most out of your photography experience.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="post-card">
          <Link to="/blog/post1">
            <img src="https://placehold.co/600x400/e2e8f0/4a5568?text=Outfits" className="w-full h-56 object-cover" alt="Blog post about outfits" />
          </Link>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">August 1, 2025</p>
            <h2 className="text-2xl font-semibold mb-3">
              <Link to="/blog/post1" className="hover:text-amber-600">What to Wear for Your Portrait Session: A Style Guide</Link>
            </h2>
            <p className="text-gray-700 mb-4">Coordinating outfits can be tricky. We break down the do's and don'ts of selecting colors, patterns, and styles...</p>
            <Link to="/blog/post1" className="font-bold text-gray-800 hover:underline">Read More &rarr;</Link>
          </div>
        </div>
        {/* You can add more blog post cards here as you create them */}
      </div>
    </main>
  );
}

export default BlogPage;