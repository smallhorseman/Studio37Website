import React, { useEffect, useState } from 'react';
import { seedTasks } from '@/data/seedContent';

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState(null);

    useEffect(() => {
        (async () => {
            const endpoints = ['/api/tasks', '/tasks'];
            let data = null;
            for (const u of endpoints) {
                try {
                    const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
                    const ct = (r.headers.get('content-type') || '').toLowerCase();
                    if (!r.ok || !ct.includes('json')) continue;
                    const j = await r.json();
                    if (Array.isArray(j)) { data = j; break; }
                } catch { continue; }
            }
            if (!data) { data = seedTasks; setNote('Using seed tasks (API unavailable).'); }
            setTasks(data);
            setLoading(false);
        })();
    }, []);

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