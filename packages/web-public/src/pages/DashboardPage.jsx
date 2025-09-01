// packages/web-public/src/pages/DashboardPage.jsx

import React, { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { FadeIn } from '../components/FadeIn'; // Corrected import path

// Helper for showing positive/negative change
const ChangeIndicator = ({ value }) => {
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
      {isPositive ? '▲' : '▼'} {Math.abs(value).toLocaleString()}
    </span>
  );
};

export default function DashboardPage() {
  const [inputDomain, setInputDomain] = useState('studio37.cc');
  const [queriedDomain, setQueriedDomain] = useState('');
  const [domainStats, setDomainStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDomainStats = useCallback(async (domain) => {
    if (!domain) return;
    setLoading(true);
    setDomainStats(null);
    setError(null);
    setQueriedDomain(domain);
    try {
      const backendUrl = 'https://sem37-api.onrender.com';
      const response = await fetch(`${backendUrl}/api/gemini-seo-analysis?domain=${domain}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDomainStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnalyzeClick = () => {
    fetchDomainStats(inputDomain);
  };

  const pieData = domainStats ? [
    { name: 'Organic', value: domainStats.monthlySEOClicks },
    { name: 'Paid', value: domainStats.monthlyPPCClicks },
  ] : [];

  const totalTraffic = (domainStats?.monthlySEOClicks || 0) + (domainStats?.monthlyPPCClicks || 0);
  const organicPercentage = totalTraffic > 0 ? ((domainStats?.monthlySEOClicks || 0) / totalTraffic) * 100 : 0;

  const COLORS = ['#10B981', '#3B82F6'];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">AI-Powered Website Insights</h1>
            <p className="mt-2 text-gray-600">Enter a domain to generate a performance overview.</p>
            <div className="mt-6 mx-auto max-w-lg flex gap-x-2">
              <input type="text" value={inputDomain} onChange={(e) => setInputDomain(e.target.value)} placeholder="e.g., apple.com" className="flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"/>
              <button onClick={handleAnalyzeClick} disabled={loading} className="flex-none rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50">
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </FadeIn>
        
        {error && <p className="text-center text-red-600 mt-4">Error: {error}</p>}
        {domainStats && (
          <FadeIn>
            <h2 className="text-xl font-semibold text-center mb-6">Showing Results for: <span className="font-bold text-indigo-600">{queriedDomain}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Organic Keywords (SEO)</h3>
                <p className="text-4xl font-bold text-gray-800 mt-4">{domainStats.organicKeywords.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Organic Keywords</p>
                <div className="mt-6">
                  <p className="text-2xl font-bold">{domainStats.monthlySEOClicks.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Est Monthly SEO Clicks</p>
                </div>
                <div className="mt-4">
                  <p className="text-xl font-bold"><ChangeIndicator value={domainStats.monthlySEOClickChange} /></p>
                  <p className="text-sm text-gray-500">Est Monthly SEO Click Change</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Traffic from Google</h3>
                <div className="relative h-48 w-48 mx-auto mt-4">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{Math.round(organicPercentage)}%</span>
                    <span className="text-sm text-gray-500">Organic</span>
                  </div>
                </div>
                <div className="h-40 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={domainStats.trafficHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="organicTraffic" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Paid Search (PPC)</h3>
                 <p className="text-4xl font-bold text-gray-800 mt-4">{domainStats.paidKeywords.toLocaleString()}</p>
                 <p className="text-sm text-gray-500">Paid Keywords</p>
                <div className="mt-6">
                   <p className="text-2xl font-bold">{domainStats.monthlyPPCClicks.toLocaleString()}</p>
                   <p className="text-sm text-gray-500">Est Monthly PPC Clicks</p>
                </div>
                <div className="mt-4">
                   <p className="text-xl font-bold">${domainStats.monthlyAdsBudget.toLocaleString()}</p>
                   <p className="text-sm text-gray-500">Est Monthly Google Ads Budget</p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}