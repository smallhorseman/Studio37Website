import React, { useMemo } from 'react';
import { useApiData, listFetcher } from '@/hooks/useApiData';
import { ResourceSection } from '@/App';

export default function ServicesPage() {
  const servicesHook = useApiData(
    'services:list',
    useMemo(() => listFetcher('/services'), [])
  );

  const renderService = (svc, idx) => {
    if (!svc || typeof svc !== 'object') {
      return (
        <div key={`invalid-${idx}`} className="p-4 border rounded text-sm text-red-500">
          Invalid service entry
        </div>
      );
    }
    return (
      <div key={svc.id || svc.slug || idx} className="p-4 border rounded">
        <h3 className="card-title">{svc.name || 'Untitled'}</h3>
        <p className="muted">{svc.description || 'Description pending.'}</p>
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Services</h1>
        <p className="page-subtitle">What we offer.</p>
      </div>
      <ResourceSection
        title="Available Services"
        hookResult={servicesHook}
        emptyMessage="Services will appear soon."
        renderItem={renderService}
      />
    </>
  );
}