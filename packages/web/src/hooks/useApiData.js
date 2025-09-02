import { useEffect, useRef, useState, useCallback } from 'react';
import apiClient from '@/api/apiClient';

// In‑memory cache (per session)
const cache = new Map();

export function useApiData(key, fetcher, { ttl = 60_000, enabled = true, immediate = true } = {}) {
  const [data, setData] = useState(() => {
    const hit = cache.get(key);
    if (hit && (Date.now() - hit.timestamp < ttl)) return hit.value;
    return undefined;
  });
  const [loading, setLoading] = useState(immediate && enabled && data === undefined);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const staleRef = useRef(false);

  const run = useCallback(async (force = false) => {
    if (!enabled) return;
    const cached = cache.get(key);
    if (!force && cached && (Date.now() - cached.timestamp < ttl)) {
      setData(cached.value);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const value = await fetcher({ signal: controller.signal, api: apiClient });
      cache.set(key, { value, timestamp: Date.now() });
      setData(value);
    } catch (e) {
      if (e.name !== 'CanceledError' && e.name !== 'AbortError') setError(e);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [key, fetcher, ttl, enabled]);

  // Initial / auto fetch
  useEffect(() => {
    if (enabled && immediate && (data === undefined || staleRef.current)) {
      run();
      staleRef.current = false;
    }
  }, [enabled, immediate, run]);

  // Manual refetch
  const refetch = useCallback(() => run(true), [run]);

  // Mark stale (e.g., external mutation)
  const invalidate = useCallback(() => {
    staleRef.current = true;
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    hasData: data !== undefined,
    isEmpty: Array.isArray(data) && data.length === 0
  };
}

// Convenience wrappers
export const buildListFetcher = (endpoint) => async ({ signal, api }) => {
  const res = await api.get(endpoint, { signal });
  return res.data?.services || res.data?.packages || res.data?.items || res.data;
};

export const listFetcher = (endpoint, select) => async ({ signal }) => {
  const res = await apiClient.get(endpoint, { signal });
  const body = res.data;
  if (select) return select(body);
  // heuristic for plural collections
  return body?.data || body?.items || body?.services || body?.packages || body;
};
