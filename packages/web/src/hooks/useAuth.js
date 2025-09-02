import { useState } from 'react';

export function useAuth() {
  // Replace with your real auth logic
  const [token] = useState(localStorage.getItem('token') || 'dummy-token');
  return { token };
}
