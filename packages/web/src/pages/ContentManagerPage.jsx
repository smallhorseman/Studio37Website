import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';

export default function ContentManagerPage() {
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

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await apiClient.delete(`/cms/posts/${postId}`);
                alert('Post deleted successfully!');
                fetchPosts(); // Refresh the list of posts
            } catch (err) {
                setError(err.message);
            }
        }
    };
    
    // Note: handleEditPost would open a modal or form with the post data

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading) return <div className="p-8">Loading CMS content...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    
    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {posts.map(post => (
                            <li key={post.id} className="py-2 border-b flex justify-between items-center">
                                <p className="font-semibold">{post.title}</p>
                                <div className="space-x-2">
                                    <button 
                                        // onClick={() => handleEditPost(post.id)} 
                                        className="px-3 py-1 text-sm font-semibold rounded-md bg-yellow-500 text-white hover:bg-yellow-600">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePost(post.id)} 
                                        className="px-3 py-1 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FadeIn>
    );
}