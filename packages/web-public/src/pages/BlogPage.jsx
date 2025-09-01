import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';

const blogPosts = [
  { slug: 'portrait-photography-houston-parks', title: "The Ultimate Guide to Portrait Photography in Houston's Northern Parks", date: 'August 24, 2025', excerpt: "Discover the stunning landscapes of our local state parks and national forests, the perfect backdrop for your next portrait session.", imageUrl: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg', category: 'Photography Tips' },
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">FROM THE JOURNAL</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">Tips, Stories, and Inspiration</p>
            <p className="mt-6 text-lg leading-8 text-gray-700">Explore our collection of articles to help you plan the perfect photoshoot, from choosing locations to selecting the right outfits.</p>
          </div>
        </FadeIn>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogPosts.map((post) => (
            <FadeIn key={post.slug}>
              <article className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  <img src={post.imageUrl} alt={`Image for blog post titled ${post.title}`} className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime="2025-08-24" className="text-gray-500">{post.date}</time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">{post.category}</span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#36454F] group-hover:text-gray-600 font-serif">
                      <button onClick={() => navigate(`/blog/${post.slug}`)} className="text-left">
                        <span className="absolute inset-0" />
                        {post.title}
                      </button>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}