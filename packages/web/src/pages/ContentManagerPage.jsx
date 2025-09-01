import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import apiClient from '../apiClient.js';
import PostEditorModal from '../components/PostEditorModal'; // Import our new modal

export default function ContentManagerPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State to manage the modal's visibility and which post is being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/cms/posts');
            setPosts(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // This function is passed to the modal to handle saving
    const handleSavePost = async (postData) => {
        try {
            if (postData.id) {
                // If the post has an ID, it's an update
                await apiClient.put(`/cms/posts/${postData.id}`, postData);
            } else {
                // Otherwise, it's a new post
                await apiClient.post('/cms/posts', postData);
            }
            fetchPosts(); // Refresh the list of posts after saving
        } catch (err) {
            setError('Failed to save post. Please try again.');
            console.error(err);
        }
    };
    
    // This function handles deleting a post
    const handleDeletePost = async (postId) => {
        // Simple confirmation before a destructive action
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await apiClient.delete(`/cms/posts/${postId}`);
                fetchPosts(); // Refresh the list after deleting
            } catch (err) {
                setError('Failed to delete post. Please try again.');
                console.error(err);
            }
        }
    };

    // Functions to open the modal for creating or editing
    const openCreateModal = () => {
        setEditingPost(null); // Clear any post data
        setIsModalOpen(true);
    };

    const openEditModal = (post) => {
        setEditingPost(post); // Set the post to be edited
        setIsModalOpen(true);
    };
    
    if (loading) return <div className="p-8">Loading CMS content...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    
    return (
        <FadeIn>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Content Manager</h1>
                    <button 
                        onClick={openCreateModal}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
                    >
                        Create New Post
                    </button>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {posts.length > 0 ? posts.map(post => (
                            <li key={post.id} className="py-2 border-b flex justify-between items-center">
                                <p className="font-semibold">{post.title}</p>
                                <div>
                                    <button onClick={() => openEditModal(post)} className="text-sm text-blue-500 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDeletePost(post.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                                </div>
                            </li>
                        )) : <p className="text-center text-gray-500">No posts found. Create one!</p>}
                    </ul>
                </div>
            </div>
            
            {/* Conditionally render the modal */}
            {isModalOpen && (
                <PostEditorModal 
                    post={editingPost} 
                    onSave={handleSavePost} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </FadeIn>
    );
}