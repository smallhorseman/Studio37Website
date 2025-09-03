import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(-1);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/projects');
            setProjects(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Prepare slides for the lightbox
    const slides = projects.map(p => ({ src: p.imageUrl, alt: p.name }));

    if (loading) return <div className="py-24 sm:py-32">Loading portfolio...</div>;
    if (error) return <div className="py-24 sm:py-32 text-red-500">Error: {error}</div>;

    // Defensive normalization
    const safeProjects = Array.isArray(projects) ? projects : (projects ? [] : []);

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">A Glimpse Into Our Gallery</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-700">Every photo tells a story. Click on any image to view it in full detail.</p>
                    </div>
                </FadeIn>
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {safeProjects.map((project, idx) => (
                        <div key={project.id} onClick={() => setIndex(idx)} className="cursor-pointer">
                            <PolaroidImage src={project.imageUrl} alt={project.name} caption={project.name} />
                        </div>
                    ))}
                </div>
                {safeProjects.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No portfolio items available.
                    </div>
                )}
                <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={slides} />
            </div>
        </div>
    );
}