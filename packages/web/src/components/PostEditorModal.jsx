import React, { useState, useEffect } from 'react';

export default function PostEditorModal({ post, onSave, onClose }) {
    // Internal state to manage the form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // This effect listens for changes to the 'post' prop.
    // If we pass an existing post, it populates the form for editing.
    // If 'post' is null, it keeps the form blank for creating.
    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the onSave function passed from the parent,
        // sending the current state of the form.
        onSave({
            id: post?.id, // Include the id if we are editing
            title,
            content,
        });
        onClose(); // Close the modal after saving
    };

    return (
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Modal content */}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Cancel
                        </button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                            Save Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}