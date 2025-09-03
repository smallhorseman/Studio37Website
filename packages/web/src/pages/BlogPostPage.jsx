import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';
import { seedBlogPosts } from '@/data/seedContent';

function loadLocalEdits() {
  try { return JSON.parse(localStorage.getItem('cms_posts_local_v1')) || []; } catch { return []; }
}

export default function BlogPostPage() {
    const navigate = useNavigate();
    const { slug } = useParams(); // FIX: was { id }
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            let found = null;
            // Try direct endpoints first
            const directCandidates = [
                `/api/cms/posts/${slug}`,
                `/cms/posts/${slug}`
            ];
            for (const url of directCandidates) {
                try {
                    const res = await fetch(url, { credentials:'include', headers:{ Accept:'application/json' } });
                    if (!res.ok) continue;
                    const ct = (res.headers.get('content-type') || '').toLowerCase();
                    if (!ct.includes('json')) continue;
                    const json = await res.json();
                    // Accept object or {data:{}} etc.
                    if (json && !Array.isArray(json)) {
                        found = json.data || json;
                        break;
                    }
                } catch { continue; }
            }

            if (!found) {
                // Fallback: search merged seed + local by slug or id
                const local = loadLocalEdits();
                const map = new Map();
                [...seedBlogPosts, ...local].forEach(p => map.set(p.id, p));
                const merged = Array.from(map.values());
                found = merged.find(p => p.slug === slug || p.id === slug) || null;
            }

            if (!found) {
                setError('Post not found (offline / API error).');
                setPost(null);
            } else {
                setPost(found);
            }
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="bg-white px-6 py-32 lg:px-8">Loading post...</div>;
    if (error) return <div className="bg-white px-6 py-32 lg:px-8 text-red-500">Error: {error}</div>;
    if (!post) return <div className="bg-white px-6 py-32 lg:px-8">Post not found.</div>;

    return (
        <div className="bg-white px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <FadeIn>
                    <p className="text-base font-semibold leading-7 text-[#468289]">{post.category}</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">{post.title}</h1>
                    <p className="mt-6 text-xl leading-8">{post.content}</p>
                </FadeIn>
                <div className="mt-16">
                    <button onClick={() => navigate('/blog')} className="text-sm font-semibold leading-6 text-[#468289]">&larr; Back to Blog</button>
                </div>
            </div>
        </div>
    );
}