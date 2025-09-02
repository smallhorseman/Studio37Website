import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import apiClient from '../api/apiClient';

export default function InternalDashboardPage() {
    const [gscData, setGscData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateText, setUpdateText] = useState(''); // State for the update form

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/get-gsc-data');
            setGscData(response.data);
            setUpdateText(JSON.stringify(response.data, null, 2)); 
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
            const dataToUpdate = JSON.parse(updateText);
            const response = await apiClient.post('/update-gsc-data', dataToUpdate);

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