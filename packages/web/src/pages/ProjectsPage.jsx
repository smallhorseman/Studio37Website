import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJsonArray } from '@/utils/fetchJsonArray';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nonArrayWarnedRef = useRef(false);
    const attemptsRef = useRef([]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProjects([]);
        const { data, error: fetchErr, attempts } = await fetchJsonArray('projects');
        attemptsRef.current = attempts;
        if (fetchErr && data.length === 0) {
            setError(
                fetchErr +
                ' Attempts: ' +
                attempts.map(a => `[${a.note}@${a.url}]`).join(' ')
            );
        }
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const safeProjects = Array.isArray(projects)
        ? projects
        : (() => {
            if (projects && !nonArrayWarnedRef.current) {
                // eslint-disable-next-line no-console
                console.warn('[ProjectsPage] Expected array for projects but received:', projects);
                nonArrayWarnedRef.current = true;
            }
            return [];
        })();

    if (loading) return <div className="p-6">Loading projects...</div>;
    if (error)
        return (
            <div className="p-6 text-red-600 space-y-4">
                <div>Error: {error}</div>
                <button
                    onClick={load}
                    className="px-4 py-2 border rounded text-sm hover:bg-red-50"
                >
                    Retry
                </button>
            </div>
        );

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-serif font-bold">Projects</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {safeProjects.map((p, idx) => (
                    <div
                        key={p?.id || p?.slug || idx}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                        <h2 className="font-semibold text-soft-charcoal">
                            {p?.name || p?.title || 'Untitled Project'}
                        </h2>
                        {p?.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-4">
                                {p.description}
                            </p>
                        )}
                    </div>
                ))}
                {!safeProjects.length && (
                    <div className="col-span-full text-center text-gray-500">
                        No projects available.
                    </div>
                )}
            </div>
        </div>
    );
}