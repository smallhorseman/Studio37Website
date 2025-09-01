import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const { token } = useAuth();

  return (
    <div>
      {/* If a token exists, show the Dashboard. If not, show the Login page. */}
      {token ? <DashboardPage /> : <LoginPage />}
    </div>
  );
}

export default App;