import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, unit = '' }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
            <span className="text-xl font-medium">{unit}</span>
        </p>
    </div>
);

export default function InternalDashboardPage() {
    const [gscData, setGscData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error("No login token found. Please log in.");

            const response = await fetch(`${API_URL}/api/get-gsc-data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch GSC data');
            
            setGscData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <FadeIn>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Internal Dashboard</h1>
                    {gscData && <p className="text-sm text-gray-500">Last Updated: {new Date(gscData.lastUpdated).toLocaleString()}</p>}
                </div>

                {loading && <p>Loading dashboard data...</p>}
                {error && <p className="text-red-500 font-semibold">Error: {error}</p>}
                
                {gscData && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Clicks" value={gscData.totalClicks} />
                        <StatCard title="Total Impressions" value={gscData.totalImpressions} />
                        <StatCard title="Average CTR" value={gscData.averageCtr} unit="%" />
                        <StatCard title="Average Position" value={gscData.averagePosition} />
                    </div>
                )}
            </div>
        </FadeIn>
    );
}