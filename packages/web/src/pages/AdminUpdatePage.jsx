import React, { useState, useEffect } from 'react';

const AdminUpdatePage = () => {
  const [clicks, setClicks] = useState('');
  const [impressions, setImpressions] = useState('');
  const [ctr, setCtr] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let tag = document.querySelector('meta[name="robots"][data-internal]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'robots';
      tag.setAttribute('data-internal','1');
      document.head.appendChild(tag);
    }
    tag.content = 'noindex,nofollow';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Updating...');

    const newData = {
      totalClicks: parseInt(clicks, 10),
      totalImpressions: parseInt(impressions, 10),
      averageCtr: parseFloat(ctr), 
      averagePosition: parseFloat(position),
      lastUpdated: new Date().toLocaleString(),
    };

    const endpoint =
      import.meta.env.VITE_ADMIN_UPDATE_ENDPOINT ||
      '/api/update-gsc-data';
    try {
<<<<<<< HEAD
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update data on the server.');
=======
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update data on the server.');
>>>>>>> 5b7e1f575058bf19f9bea63146faf682fbf5588b
      }

      setStatus(responseData.message);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Admin Panel</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Update GSC Data
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Enter the latest numbers from your Google Search Console Performance report.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20 space-y-6">
            <div>
              <label htmlFor="clicks" className="block text-sm font-semibold leading-6 text-gray-900">Total Clicks</label>
              <input type="number" name="clicks" id="clicks" value={clicks} onChange={e => setClicks(e.target.value)} required className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
            <div>
              <label htmlFor="impressions" className="block text-sm font-semibold leading-6 text-gray-900">Total Impressions</label>
              <input type="number" name="impressions" id="impressions" value={impressions} onChange={e => setImpressions(e.target.value)} required className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
            <div>
              <label htmlFor="ctr" className="block text-sm font-semibold leading-6 text-gray-900">Average CTR (e.g., 2.5%)</label>
              <input type="text" name="ctr" id="ctr" value={ctr} onChange={e => setCtr(e.target.value)} required className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
             <div>
              <label htmlFor="position" className="block text-sm font-semibold leading-6 text-gray-900">Average Position</label>
              <input type="number" step="0.1" name="position" id="position" value={position} onChange={e => setPosition(e.target.value)} required className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
            <div className="text-center">
              <button type="submit" disabled={isLoading} className="rounded-md bg-indigo-600 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Data'}
              </button>
            </div>
            {status && <p className="text-center text-gray-600 mt-4">{status}</p>}
          </form>
        </>
      </div>
    </div>
  );
}

export default AdminUpdatePage;