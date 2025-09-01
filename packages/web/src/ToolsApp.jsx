import React from 'react';

export default function ToolsApp() {
  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#1a202c', 
        color: '#a0aec0',
        fontFamily: 'monospace'
      }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem' }}>SEM37 / Tools Dashboard</h1>
        <p style={{ marginTop: '1rem' }}>[CRM, Project Planner, and SpyFu Tools will be rendered here.]</p>
        <p style={{ marginTop: '0.5rem' }}>Login and application logic starts in this component.</p>
      </div>
    </div>
  );
}