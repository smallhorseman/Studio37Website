import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = import.meta.env.VITE_API_URL;

export default function InternalDashboardPage() {
    const [gscData, setGscData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateText, setUpdateText] = useState(''); // State for the update form

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error("No login token found. Please log in again.");

            const response = await fetch(`${API_URL}/api/get-gsc-data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch GSC data');
            setGscData(data);
            // Pre-fill the textarea with current data for easy editing
            setUpdateText(JSON.stringify(data, null, 2)); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error("No login token found.");

            // This fetch call now includes the token in its headers
            const response = await fetch(`${API_URL}/api/update-gsc-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: updateText, // Send the text from the textarea
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update data');
            
            alert('GSC Data Updated Successfully!');
            fetchData(); // Refresh the data after updating
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Internal Dashboard</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Update Google Search Console Data</h2>
                    {loading && <p>Loading GSC data...</p>}
                    {error && <p className="text-red-500 font-semibold mb-4">Error: {error}</p>}
                    <form onSubmit={handleUpdate}>
                        <textarea
                            className="w-full h-48 p-2 border rounded font-mono text-sm"
                            value={updateText}
                            onChange={(e) => setUpdateText(e.target.value)}
                        />
                        <button type="submit" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                            Save GSC Data
                        </button>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}