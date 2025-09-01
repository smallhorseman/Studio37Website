import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = import.meta.env.VITE_API_URL;

export default function InternalDashboardPage() {
    const [gscData, setGscData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGscData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/get-gsc-data`);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const data = await response.json();
            setGscData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGscData();
    }, [fetchGscData]);

    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Internal Dashboard</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">Google Search Console Data</h2>
                    {loading && <p>Loading GSC data...</p>}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {gscData && <pre className="overflow-x-auto p-2 bg-gray-100 rounded mt-2">{JSON.stringify(gscData, null, 2)}</pre>}
                </div>
            </div>
        </FadeIn>
    );
}