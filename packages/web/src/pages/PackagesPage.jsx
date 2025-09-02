import React, { useMemo } from 'react';
import { useApiData, listFetcher } from '@/hooks/useApiData';
import { ResourceSection } from '@/App';

export default function PackagesPage() {
  const packagesHook = useApiData(
    'packages:list',
    useMemo(() => listFetcher('/packages'), [])
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Packages</h1>
        <p className="page-subtitle">Choose what fits your needs.</p>
      </div>
      <ResourceSection
        title="Our Packages"
        hookResult={packagesHook}
        emptyMessage="No packages published yet."
        renderItem={(pkg, i) => (
          <div key={pkg.id || pkg.name || i} className="card">
            <h3 className="card-title">{pkg.name || 'Unnamed Package'}</h3>
            <p className="muted">{pkg.description || pkg.duration || 'Details pending.'}</p>
            {pkg.price && <p className="mt-2 font-semibold">{pkg.price}</p>}
            {Array.isArray(pkg.features) && pkg.features.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm list-disc list-inside">
                {pkg.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
        )}
      />
    </>
  );
}