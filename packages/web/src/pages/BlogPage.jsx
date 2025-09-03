import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { seedBlogPosts } from '@/data/seedContent';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from "../components/PolaroidImage.jsx";

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    let data = null;
    const attempts = [];
    const candidates = [
      '/api/cms/posts',
      '/api/cms/posts/',
      '/cms/posts',
      '/cms/posts/'
    ];
    for (const url of candidates) {
      try {
        const res = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (!res.ok) { attempts.push(`[${res.status}@${url}]`); continue; }
        if (!ct.includes('json')) { attempts.push(`[nonjson@${url}]`); continue; }
        const json = await res.json();
        if (Array.isArray(json)) { data = json; break; }
        if (json && Array.isArray(json.results)) { data = json.results; break; }
        attempts.push(`[shape@${url}]`);
      } catch (e) {
        attempts.push(`[err@${url}]`);
        continue;
      }
    }
    if (!data) {
      // Merge seed + local (if any from CMS draft editing)
      let local = [];
      try { local = JSON.parse(localStorage.getItem('cms_posts_local_v1')) || []; } catch { /* ignore */ }
      const map = new Map();
      [...seedBlogPosts, ...local].forEach(p => map.set(p.id, p));
      data = Array.from(map.values());
      if (!data.length) {
        setError('Unable to load posts ' + attempts.join(' '));
        setLoading(false);
        return;
      }
    }
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (loading) return <div className="p-8">Loading blog posts...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

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
          {posts.length === 0 ? (
            <div className="col-span-1 text-center">
              <h1 className="text-3xl font-handwriting mb-6">Blog</h1>
              <p>Our blog posts will appear here soon.</p>
            </div>
          ) : (
            posts.map((post) => (
              <FadeIn key={post.id}>
                <div onClick={() => navigate(`/blog/${post.id}`)} className="cursor-pointer group">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}