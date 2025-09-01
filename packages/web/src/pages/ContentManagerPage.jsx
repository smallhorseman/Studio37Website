import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = process.env.REACT_APP_API_URL;

// The PostEditorModal component can remain the same

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
            const response = await fetch(`${API_URL}/api/cms/posts`);
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
        const url = id ? `${API_URL}/api/cms/posts/${id}` : `${API_URL}/api/cms/posts`;
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
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/cms/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete post.');
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    // The rest of your component's JSX can remain the same
}