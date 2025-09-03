import React, { useEffect } from 'react';

export default function ToolsPage() {
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
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-handwriting mb-6">Admin Tools</h1>
      <p className="text-sm text-gray-600">
        This is the tools page for admin users. Select a section from the navigation (CRM, Projects, CMS, To‑Dos).
      </p>
    </div>
  );
}
