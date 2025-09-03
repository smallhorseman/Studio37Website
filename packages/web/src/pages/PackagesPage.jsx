import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray';

export default function PackagesPage() {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const attemptsRef = useRef([]);
  const warnedRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPackagesData([]);
    const { data, error: fetchErr, attempts } = await fetchJsonArray('packages', {
      override: import.meta.env.VITE_PACKAGES_ENDPOINT
    });
    attemptsRef.current = attempts;
    if (fetchErr && data.length === 0) {
      setError(
        fetchErr + ' Attempts: ' +
        attempts.map(a => `[${a.classification}@${a.url}]`).join(' ')
      );
    }
    setPackagesData(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const safePackages = Array.isArray(packagesData)
    ? packagesData
    : (() => {
        if (packagesData && !warnedRef.current) {
          // eslint-disable-next-line no-console
          console.warn('[PackagesPage] Expected array but received:', packagesData);
          warnedRef.current = true;
        }
        return [];
      })();

  if (loading) return <div className="py-16 px-6">Loading packages...</div>;

  if (error) return (
    <div className="py-16 px-6 space-y-4 text-red-600">
      <div>Error: {error}</div>
      <div className="text-xs text-gray-500">
        If this persists: set VITE_PACKAGES_ENDPOINT to a valid JSON array endpoint or enable a Netlify proxy for /api/packages.
      </div>
      <button
        onClick={load}
        className="px-4 py-2 border rounded text-sm hover:bg-red-50"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="py-16 px-6 space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold text-soft-charcoal">Packages</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Browse available packages (data fetched from API).
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {safePackages.map((pkg, idx) => (
          <div
            key={pkg?.id || pkg?.slug || idx}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold text-soft-charcoal">
              {pkg?.name || pkg?.title || 'Untitled Package'}
            </h2>
            {pkg?.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-4">
                {pkg.description}
              </p>
            )}
            {pkg?.price != null && (
              <p className="mt-3 text-sm font-medium text-faded-teal">
                ${pkg.price}
              </p>
            )}
          </div>
        ))}

        {!safePackages.length && (
          <div className="col-span-full text-center text-gray-500">
            No packages available.
          </div>
        )}
      </div>
    </div>
  );
}