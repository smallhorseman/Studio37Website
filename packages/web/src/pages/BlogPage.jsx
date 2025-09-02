import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from "../components/PolaroidImage.jsx";

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/cms/posts');
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
          {posts.map((post) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}