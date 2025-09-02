import { useState } from 'react';

export function useAuth() {
  // Replace this with your actual authentication logic
  const [token] = useState(null);
  return { token };
}
