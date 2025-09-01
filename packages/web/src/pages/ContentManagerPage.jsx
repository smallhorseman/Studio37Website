import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import apiClient from '../apiClient.js'; // Import our new API client

// We still need to build the PostEditorModal component
// import PostEditorModal from '../components/PostEditorModal';

export default function ContentManagerPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for the modal, e.g.,:
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editingPost, setEditingPost] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // The apiClient automatically adds the auth token and base URL.
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

    // We will build these functions next. They will also use the apiClient.
    const handleSavePost = async (postData) => {
        // if (postData.id) {
        //   await apiClient.put(`/cms/posts/${postData.id}`, postData);
        // } else {
        //   await apiClient.post('/cms/posts', postData);
        // }
        // fetchPosts(); // Refresh list
    };
    
    const handleDeletePost = async (postId) => {
        // await apiClient.delete(`/cms/posts/${postId}`);
        // fetchPosts(); // Refresh list
    };
    
    if (loading) return <div className="p-8">Loading CMS content...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    
    return (
        <FadeIn>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Content Manager</h1>
                    <button 
                        // onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
                    >
                        Create New Post
                    </button>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {posts.map(post => (
                            <li key={post.id} className="py-2 border-b flex justify-between items-center">
                                <p className="font-semibold">{post.title}</p>
                                <div>
                                    {/* Buttons for future functionality */}
                                    <button className="text-sm text-blue-500 mr-2">Edit</button>
                                    <button className="text-sm text-red-500">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Modal for creating/editing posts would go here */}
            {/* {isModalOpen && <PostEditorModal onClose={() => setIsModalOpen(false)} onSave={handleSavePost} post={editingPost} />} */}
        </FadeIn>
    );
}