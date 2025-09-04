import { API_BASE } from '@/config/env';
import { REMOTE_API_BASE, PROXY_API_BASE, isSameOrigin } from '@/config/env';

const runningOnTools = (typeof window !== 'undefined') && window.location.hostname.includes('tools.');
const KNOWN_RESOURCE_PREFIXES = ['/services','/packages','/projects','/cms/posts','/crm','/tasks'];

// Helper to determine the best API endpoint to use
export function getEndpoint(path) {
  // Strip leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For same-origin requests, prefer the proxy to avoid CORS
  if (isSameOrigin() || runningOnTools) {
    return `${PROXY_API_BASE}/${cleanPath}`;
  }
  
  // Otherwise use the remote API
  return `${REMOTE_API_BASE}/api/${cleanPath}`;
}

// Main API client methods
export async function fetchApi(path, options = {}) {
  const url = getEndpoint(path);
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // Add authorization if available
  const token = localStorage.getItem('jwt_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });
  
  // Handle unauthorized responses
  if (response.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }
  
  // Handle successful responses
  if (response.ok) {
    // Handle empty responses
    const text = await response.text();
    if (!text) return null;
    
    // Parse JSON responses
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse API response as JSON', e);
      return text;
    }
  }
  
  // Handle error responses
  throw new Error(`API error: ${response.status} ${response.statusText}`);
}