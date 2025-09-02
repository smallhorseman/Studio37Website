import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/projects');
            setProjects(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    if (loading) return <div className="p-8">Loading projects...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold">{project.name}</h2>
                            <p className="text-gray-600">{project.client}</p>
                        </div>
                    ))}
                </div>
            </div>
        </FadeIn>
    );
}