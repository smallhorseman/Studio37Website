import React, { useEffect, useState, useCallback } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray.js'; // FIX: explicit extension
import { FadeIn } from '../components/FadeIn';
import { seedCrm } from '@/data/seedContent';

export default function CRMPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNote(null);

    const { data, error: fetchErr } = await fetchJsonArray('crm');

    if (data && data.length > 0) {
      setRecords(data);
    } else {
      // If fetchJsonArray fails or returns empty, use seed as fallback
      setRecords(seedCrm);
      setNote('Using seed CRM data (API unavailable or no records found).');
      if (fetchErr) {
        // Log the underlying error for debugging but don't show it to the user
        console.warn('[CRMPage] API fetch error, using seed:', fetchErr);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
        {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded">{note}</div>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r, idx) => (
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
          {!records.length && (
            <div className="col-span-full text-center text-gray-500">
              No CRM records available.
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}