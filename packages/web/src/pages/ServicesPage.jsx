import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const attemptsRef = useRef([]);
  const warnedRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setServices([]);
    const { data, error: fetchErr, attempts } = await fetchJsonArray('services', {
      override: import.meta.env.VITE_SERVICES_ENDPOINT
    });
    attemptsRef.current = attempts;
    if (fetchErr && data.length === 0) {
      setError(fetchErr + ' Attempts: ' +
        attempts.map(a => `[${a.classification}@${a.url}]`).join(' '));
    }
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const safe = Array.isArray(services) ? services : (() => {
    if (services && !warnedRef.current) {
      // eslint-disable-next-line no-console
      console.warn('[ServicesPage] Expected array but received:', services);
      warnedRef.current = true;
    }
    return [];
  })();

  if (loading) return <div className="py-16 px-6">Loading services...</div>;
  if (error) return (
    <div className="py-16 px-6 space-y-4 text-red-600">
      <div>Error: {error}</div>
      <button onClick={load} className="px-4 py-2 border rounded text-sm hover:bg-red-50">Retry</button>
    </div>
  );

  return (
    <div className="py-16 px-6 space-y-8">
      <h1 className="text-3xl font-serif font-bold text-soft-charcoal">Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {safe.map((s, i) => (
          <div key={s?.id || s?.slug || i} className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-semibold">{s?.name || s?.title || 'Untitled Service'}</h2>
            {s?.description && <p className="mt-2 text-sm text-gray-600 line-clamp-4">{s.description}</p>}
          </div>
        ))}
        {!safe.length && (
          <div className="col-span-full text-center text-gray-500">
            No services available.
          </div>
        )}
      </div>
    </div>
  );
}