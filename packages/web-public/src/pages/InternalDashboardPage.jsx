import React from 'react';
import { FadeIn } from '../components/FadeIn';
import gscData from '../data/gsc-data.json'; // Imports the data directly!

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
    <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
  </div>
);

export default function InternalDashboardPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">INTERNAL DASHBOARD</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Google Search Console Performance
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Real data for studio37.cc, updated from the Admin Panel. Last updated: <span className="font-semibold">{gscData.lastUpdated}</span>
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
              <StatCard label="Total Clicks" value={gscData.totalClicks.toLocaleString()} />
              <StatCard label="Total Impressions" value={gscData.totalImpressions.toLocaleString()} />
              <StatCard label="Average CTR" value={gscData.averageCtr} />
              <StatCard label="Average Position" value={gscData.averagePosition} />
            </dl>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}