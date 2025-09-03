import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray';
import { FadeIn } from '../components/FadeIn';

export default function CRMPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nonArrayWarnedRef = useRef(false);
  const attemptsRef = useRef([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRecords([]);
    const { data, error: fetchErr, attempts } = await fetchJsonArray('crm'); // adjust endpoint if different
    attemptsRef.current = attempts;
    if (fetchErr && data.length === 0) {
      setError(
        fetchErr +
          ' Attempts: ' +
          attempts.map(a => `[${a.note}@${a.url}]`).join(' ')
      );
    }
    setRecords(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const safeRecords = Array.isArray(records)
    ? records
    : (() => {
        if (records && !nonArrayWarnedRef.current) {
          // eslint-disable-next-line no-console
            console.warn('[CRMPage] Expected array for CRM records but received:', records);
          nonArrayWarnedRef.current = true;
        }
        return [];
      })();

  if (loading) return <div className="p-6">Loading CRM data...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600 space-y-4">
        <div>Error: {error}</div>
        <button
          onClick={load}
          className="px-4 py-2 border rounded text-sm hover:bg-red-50"
        >
          Retry
        </button>
      </div>
    );

  return (
    <FadeIn>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-serif font-bold">CRM</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeRecords.map((r, idx) => (
            <div
              key={r?.id || r?.email || idx}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h2 className="font-semibold text-soft-charcoal">
                {r?.name || r?.full_name || 'Unnamed'}
              </h2>
              {r?.email && (
                <p className="text-xs mt-1 text-gray-600">{r.email}</p>
              )}
              {r?.company && (
                <p className="text-xs mt-1 text-gray-500 italic">{r.company}</p>
              )}
            </div>
          ))}
          {!safeRecords.length && (
            <div className="col-span-full text-center text-gray-500">
              No CRM records available.
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}