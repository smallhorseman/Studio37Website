import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = import.meta.env.VITE_API_URL;

// Assume PostEditorModal component exists and is imported
// ...

export default function ContentManagerPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // ... other state for modal

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error("No login token found. Please log in again.");

            const response = await fetch(`${API_URL}/api/cms/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Note: handleSavePost and handleDeletePost would also need to include the token header
    
    if (loading) return <div className="p-8">Loading CMS content...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    
    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {posts.map(post => (
                            <li key={post.id} className="py-2 border-b">
                                <p className="font-semibold">{post.title}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FadeIn>
    );
}