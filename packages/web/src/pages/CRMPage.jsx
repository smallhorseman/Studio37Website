import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray';
import { FadeIn } from '../components/FadeIn';
import { seedCrm } from '@/data/seedContent';

export default function CRMPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);
  const nonArrayWarnedRef = useRef(false);
  const attemptsRef = useRef([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNote(null);
    setRecords([]);
    const { data, error: fetchErr } = await fetchJsonArray('crm', {
      override: import.meta.env.VITE_CRM_ENDPOINT
    });
    let final = data;
    if ((!final || !final.length) && fetchErr) {
      // manual fallback endpoints
      const candidates = ['/api/crm','/crm'];
      for (const url of candidates) {
        try {
          const r = await fetch(url, { credentials:'include', headers:{Accept:'application/json'} });
          const ct = (r.headers.get('content-type')||'').toLowerCase();
          if (!r.ok || !ct.includes('json')) continue;
          const j = await r.json();
          if (Array.isArray(j)) { final = j; break; }
        } catch { continue; }
      }
      if (!final || !final.length) {
        final = seedCrm;
        setNote('Using seed CRM data (API unavailable).');
      }
      if (fetchErr && (!final || final === seedCrm))
        setError(null); // suppress noisy combined error now that we have seed
    }
    setRecords(Array.isArray(final) ? final : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
        {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded">{note}</div>}
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