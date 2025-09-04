import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <div className="p-8 text-center">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${location.pathname}`} replace />;
  }

  return children;
}
