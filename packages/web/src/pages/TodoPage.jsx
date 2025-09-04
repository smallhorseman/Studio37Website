import React, { useEffect, useState, useCallback } from 'react';
import { seedTasks } from '@/data/seedContent';
import { fetchJsonArray } from '@/utils/fetchJsonArray';

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setNote(null);
        const { data, error } = await fetchJsonArray('tasks');

        if (data && data.length > 0) {
            setTasks(data);
        } else {
            setTasks(seedTasks);
            setNote('Using seed tasks (API unavailable or no tasks found).');
            if (error) {
                console.warn('[TodoPage] API fetch error, using seed:', error);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (loading) return <div className="text-sm text-gray-500">Loading tasks...</div>;

    return (
        <div className="space-y-3">
            {note && <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 px-2 py-1 rounded">{note}</div>}
            {tasks.map(t => (
                <label key={t.id} className="flex items-center gap-2 text-sm bg-white p-2 border rounded">
                    <input type="checkbox" defaultChecked={t.done} disabled />
                    <span className={t.done ? 'line-through text-gray-400' : ''}>{t.title}</span>
                </label>
            ))}
        </div>
    );
}