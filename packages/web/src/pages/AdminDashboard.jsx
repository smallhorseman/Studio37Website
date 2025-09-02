import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient.js';

const AdminUpdatePage = () => {
  const [property, setProperty] = useState('https://studio37.cc');
  const [clicks, setClicks] = useState('');
  const [impressions, setImpressions] = useState('');

  const [currentData, setCurrentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageColor, setMessageColor] = useState('text-gray-700');

  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/get-gsc-data');
        setCurrentData(response.data);
      } catch (error) {
        setStatusMessage('Could not load current data.');
        setMessageColor('text-red-600');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Submitting update...');
    setMessageColor('text-blue-600');

    const dataToUpdate = {
      property,
      updates: {
        clicks: parseInt(clicks, 10),
        impressions: parseInt(impressions, 10),
      },
    };

    try {
      const response = await apiClient.post('/update-gsc-data', dataToUpdate);

      setStatusMessage('Data updated successfully!');
      setMessageColor('text-green-600');
      console.log('Success:', response.data);
      setClicks('');
      setImpressions('');
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An unexpected error occurred.';
      setStatusMessage(`Error: ${errorMsg}`);
      setMessageColor('text-red-600');
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#36454F] font-serif">
            Update GSC Data
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the latest numbers from Google Search Console.
          </p>
        </div>

        {currentData && (
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <h3 className="font-semibold text-gray-800">Current Stored Data:</h3>
                <pre className="mt-2 whitespace-pre-wrap break-words">{JSON.stringify(currentData, null, 2)}</pre>
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="property" className="sr-only">Property</label>
              <input id="property" name="property" type="text" value={property} readOnly className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#D2B48C] focus:border-[#D2B48C] focus:z-10 sm:text-sm bg-gray-100" />
            </div>
            <div>
              <label htmlFor="clicks" className="sr-only">Clicks</label>
              <input id="clicks" name="clicks" type="number" required value={clicks} onChange={(e) => setClicks(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#D2B48C] focus:border-[#D2B48C] focus:z-10 sm:text-sm" placeholder="Total Clicks" />
            </div>
            <div>
              <label htmlFor="impressions" className="sr-only">Impressions</label>
              <input id="impressions" name="impressions" type="number" required value={impressions} onChange={(e) => setImpressions(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#D2B48C] focus:border-[#D2B48C] focus:z-10 sm:text-sm" placeholder="Total Impressions" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#36454F] bg-[#D2B48C] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2B48C] disabled:bg-gray-300">
              {isLoading ? 'Updating...' : 'Submit Update'}
            </button>
          </div>
        </form>

        {statusMessage && (
          <p className={`text-center text-sm ${messageColor}`}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUpdatePage;