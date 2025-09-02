import React, { useMemo } from 'react';
import { useApiData, listFetcher } from '@/hooks/useApiData';
import { ResourceSection } from '@/App';

export default function ServicesPage() {
  const servicesHook = useApiData(
    'services:list',
    useMemo(() => listFetcher('/services'), [])
  );

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
        renderItem={(svc, i) => (
          <div key={svc.id || svc.name || i} className="card">
            <h3 className="card-title">{svc.name || 'Untitled'}</h3>
            <p className="muted">{svc.description || 'Description pending.'}</p>
          </div>
        )}
      />
    </>
  );
}