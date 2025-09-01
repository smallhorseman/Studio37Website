import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

const blogPosts = [
  { slug: 'portrait-photography-houston-parks', title: "Houston's Northern Parks", date: 'August 24, 2025', excerpt: "Discover the stunning landscapes of our local state parks and national forests, the perfect backdrop for your next portrait session.", imageUrl: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg', category: 'Photography Tips' },
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-warm-tan tracking-widest">FROM THE JOURNAL</h2>
            <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">Tips, Stories, and Inspiration</p>
          </div>
        </FadeIn>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogPosts.map((post) => (
            <FadeIn key={post.slug}>
              <div onClick={() => navigate(`/blog/${post.slug}`)} className="cursor-pointer group">
                <PolaroidImage 
                  src={post.imageUrl} 
                  alt={post.title}
                  caption={post.title}
                />
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <p className="mt-2 text-base leading-6 text-gray-600 group-hover:text-warm-tan">{post.excerpt}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}