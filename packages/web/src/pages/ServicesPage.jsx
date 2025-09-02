import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import { FadeIn } from '../components/FadeIn';
import { PolaroidImage } from '../components/PolaroidImage';

export default function ServicesPage() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/services');
            setServices(response.data);
        } catch (err) {
            setError(err.response?.status === 404
                ? "Services not found. Please check back later."
                : "An error occurred loading services.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    if (loading) return <div className="py-24 sm:py-32">Loading services...</div>;
    if (error) {
        return <div className="p-8 text-red-500">Unable to load services. Please try again later.</div>;
    }

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-warm-tan tracking-widest">OUR SERVICES</h2>
                        <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-soft-charcoal sm:text-4xl">What We Offer</p>
                        <p className="mt-6 text-lg leading-8 text-gray-700">We provide a range of creative services to capture your most important moments and build your brand's visual identity.</p>
                    </div>
                </FadeIn>
                <div className="mt-16 space-y-20">
                    {services.map((service, index) => (
                        <div key={service.name} className={`flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} items-center gap-x-8 gap-y-10`}>
                            <div className="lg:w-1/2 flex justify-center">
                                <PolaroidImage src={service.imageUrl} alt={service.name} rotation={service.rotation} />
                            </div>
                            <div className="lg:w-1/2">
                                <FadeIn>
                                    <h3 className="text-2xl font-serif font-bold text-soft-charcoal">{service.name}</h3>
                                    <p className="mt-4 text-base leading-7 text-gray-600">{service.description}</p>
                                    <button onClick={() => navigate('/packages')} className="mt-6 rounded-md bg-faded-teal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-soft-charcoal">
                                        View Packages
                                    </button>
                                </FadeIn>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}