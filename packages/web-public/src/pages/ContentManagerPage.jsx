// packages/web-public/src/pages/ContentManagerPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const backendUrl = 'https://sem37-api.onrender.com';

// Editor Modal for creating/updating posts
const PostEditorModal = ({ post, onClose, onSave }) => {
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [status, setStatus] = useState(post?.status || 'draft');

    const handleSave = () => {
        onSave({ ...post, title, slug, content, status, dateCreated: post?.dateCreated || new Date().toISOString() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl animate-fade-in-up">
                <h2 className="text-2xl font-semibold mb-4">{post?.id ? 'Edit Post' : 'Create New Post'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Slug (e.g., my-first-post)</label>
                        <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content (Markdown supported)</label>
                        <textarea rows="15" value={content} onChange={e => setContent(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">Save Post</button>
                </div>
            </div>
        </div>
    );
};

export default function ContentManagerPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // --- FIXED: Added '/cms' to the API path ---
            const response = await fetch(`${backendUrl}/api/cms/posts`);
            if (!response.ok) throw new Error('Failed to fetch posts.');
            const data = await response.json();
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

    const handleSavePost = async (postData) => {
        const { id, ...data } = postData;
        // --- FIXED: Added '/cms' to the API path ---
        const url = id ? `${backendUrl}/api/cms/posts/${id}` : `${backendUrl}/api/cms/posts`;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save post.');
            setIsModalOpen(false);
            setEditingPost(null);
            fetchPosts(); // Refresh list after saving
        } catch (err) {
            setError(err.message);
        }
    };

    // --- NEW: Function to handle deleting a post ---
    const handleDeletePost = async (postId) => {
        // Confirmation dialog to prevent accidental deletion
        if (!window.confirm('Are you sure you want to delete this post forever?')) {
            return;
        }

        try {
            const url = `${backendUrl}/api/cms/posts/${postId}`;
            const response = await fetch(url, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete post.');
            fetchPosts(); // Refresh list after deleting
        } catch (err) {
            setError(err.message);
        }
    };
    
    const openEditor = (post = null) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            {isModalOpen && <PostEditorModal post={editingPost} onClose={() => setIsModalOpen(false)} onSave={handleSavePost} />}
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Content Manager</h1>
                        <button onClick={() => openEditor()} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200">
                            + New Post
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {loading && <p className="text-center text-gray-500">Loading content...</p>}
                        {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}
                        <ul className="divide-y divide-gray-200">
                            {!loading && posts.length === 0 && <p className="text-center text-gray-500 py-4">No posts found. Create one to get started!</p>}
                            {posts.map(post => (
                                <li key={post.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-semibold text-lg text-gray-900">{post.title}</p>
                                        <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span>
                                        <span className="text-sm text-gray-500">/{post.slug}</span>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button onClick={() => openEditor(post)} className="font-semibold text-indigo-600 hover:text-indigo-800">Edit</button>
                                        {/* --- NEW: Delete button --- */}
                                        <button onClick={() => handleDeletePost(post.id)} className="font-semibold text-red-600 hover:text-red-800">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}