import { useState } from 'react';

export function useAuth() {
  // For testing, always return a token
  const [token] = useState('dummy-token');
  return { token };
}
