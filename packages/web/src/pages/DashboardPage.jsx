import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';

export default function DashboardPage() {
    const [domain, setDomain] = useState('studio37.cc');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const response = await fetch(`/api/analyze-seo?url=${encodeURIComponent(domain)}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error: ${response.status} ${errText}`);
            }
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn>
            <div className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">AI-Powered Website Insights</h1>
                <p className="mb-6">Enter a domain to generate a performance overview.</p>
                <div className="flex justify-center">
                    <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="p-2 border rounded-l-md w-1/3" placeholder="example.com" />
                    <button onClick={handleAnalyze} disabled={loading} className="bg-gray-800 text-white p-2 rounded-r-md disabled:bg-gray-400">
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>
                {error && <p className="mt-4 text-red-500">Error: {error}</p>}
                {analysis && (
                    <div className="mt-8 p-4 bg-white rounded-lg shadow text-left max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold">Analysis for {domain}</h2>
                        <pre className="overflow-x-auto p-2 bg-gray-100 rounded mt-2">{JSON.stringify(analysis, null, 2)}</pre>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}