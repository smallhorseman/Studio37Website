import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = process.env.REACT_APP_API_URL;

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    // ... add state for creating a new project

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    if (loading) return <div>Loading projects...</div>;

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