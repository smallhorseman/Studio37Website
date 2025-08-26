import React, { useState, useEffect } from 'react';
import { FadeIn } from '../App'; // Assuming FadeIn is exported from App.jsx

// Helper component for displaying stats
const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
    <dd className="mt-1 text-3xl font-semibold text-[#36454F]">{value}</dd>
  </div>
);

export default function DashboardPage() {
  const [domainStats, setDomainStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomainStats = async () => {
      const domainToQuery = 'studio37.cc';
      // IMPORTANT: This is your actual SpyFu API key from the curl command.
      const apiKey = 'Basic Y2VvQHBvbnlib3kud2luOjE5IUFsZWJlc3Q='; 
      
      // Using a proxy to prevent CORS errors in the browser.
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.spyfu.com/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domainToQuery}&countryCode=US`)}`;

      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            // We are adding your specific Authorization key here.
            'Authorization': apiKey,
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if the proxy returned an error from the target server
        if (data.contents && data.contents.includes("error")) {
             try {
                const errorJson = JSON.parse(data.contents);
                throw new Error(`API Error: ${errorJson.error.message}`);
             } catch(e) {
                throw new Error('An unknown API error occurred. The response might not be valid JSON.');
             }
        }

        const contents = JSON.parse(data.contents);

        if (contents.results && contents.results.length > 0) {
          setDomainStats(contents.results[0]);
        } else {
          setDomainStats(null); // No results found
        }
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch domain stats:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainStats();
  }, []);

  return (
    <div className="bg-[#FFFDF6] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#D2B48C] tracking-widest">SEO DASHBOARD</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#36454F] sm:text-4xl font-serif">
              Website Performance Overview
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Tracking key SEO and PPC metrics for studio37.cc. This data helps us understand our visibility on Google.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-16 max-w-4xl">
          {loading && <p className="text-center">Loading domain stats...</p>}
          {error && <p className="text-center text-red-600">Error: {error}. Please check your API key and ensure the domain is correct.</p>}
          {domainStats && (
            <FadeIn>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                  label="Estimated Monthly SEO Clicks" 
                  value={Math.round(domainStats.monthlyOrganicClicks).toLocaleString()} 
                />
                <StatCard 
                  label="Organic Keywords" 
                  value={domainStats.totalOrganicResults.toLocaleString()} 
                />
                <StatCard 
                  label="Estimated SEO Value" 
                  value={`$${Math.round(domainStats.monthlyOrganicValue).toLocaleString()}`} 
                />
                <StatCard 
                  label="Estimated Monthly PPC Clicks" 
                  value={Math.round(domainStats.monthlyPaidClicks).toLocaleString()} 
                />
                <StatCard 
                  label="Paid Keywords" 
                  value={domainStats.totalAdsPurchased.toLocaleString()} 
                />
                <StatCard 
                  label="Estimated Ad Budget" 
                  value={`$${Math.round(domainStats.monthlyBudget).toLocaleString()}`} 
                />
              </dl>
            </FadeIn>
          )}
           {!loading && !domainStats && !error && (
             <p className="text-center text-gray-600">No data available for this domain. This could be due to the domain being new or having low search visibility.</p>
           )}
        </div>
      </div>
    </div>
  );
}
