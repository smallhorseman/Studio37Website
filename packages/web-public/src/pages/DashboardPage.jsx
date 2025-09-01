import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = process.env.REACT_APP_API_URL;

export default function DashboardPage() {
    const [domain, setDomain] = useState('studio37.cc');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysis(null);
        try {
            const response = await fetch(`${API_URL}/api/gemini-seo-analysis?domain=${domain}`);
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error("Analysis failed:", error);
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
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="p-2 border rounded-l-md w-1/3"
                        placeholder="example.com"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-gray-800 text-white p-2 rounded-r-md"
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>
                {analysis && (
                    <div className="mt-8 p-4 bg-white rounded-lg shadow text-left">
                        <h2 className="text-2xl font-bold">Analysis for {domain}</h2>
                        <pre>{JSON.stringify(analysis, null, 2)}</pre>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}