// packages/web-public/src/pages/TodoPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const backendUrl = 'https://sem37-api.onrender.com';

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [tasksRes, projectsRes] = await Promise.all([
                fetch(`${backendUrl}/api/tasks`),
                fetch(`${backendUrl}/api/projects`)
            ]);
            if (!tasksRes.ok || !projectsRes.ok) throw new Error('Failed to fetch data.');
            const tasksData = await tasksRes.json();
            const projectsData = await projectsRes.json();
            setTasks(tasksData);
            setProjects(projectsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getProjectName = (projectId) => projects.find(p => p.id === projectId)?.name || 'Unknown Project';

    const toggleTask = async (task) => {
        await fetch(`${backendUrl}/api/tasks/${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isCompleted: !task.isCompleted }) });
        fetchData(); // Refresh the list
    };

    // Group tasks by project for display
    const tasksByProject = tasks.reduce((acc, task) => {
        (acc[task.projectId] = acc[task.projectId] || []).push(task);
        return acc;
    }, {});

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Master To-Do List</h1>
                    {loading ? <p>Loading all tasks...</p> : (
                        <div className="space-y-6">
                            {Object.keys(tasksByProject).length > 0 ? Object.entries(tasksByProject).map(([projectId, projectTasks]) => (
                                <div key={projectId} className="bg-white p-6 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">{getProjectName(projectId)}</h2>
                                    <div className="space-y-2">
                                        {projectTasks.map(task => (
                                            <div key={task.id} className="flex items-center bg-gray-50 p-3 rounded-md">
                                                <input type="checkbox" checked={task.isCompleted} onChange={() => toggleTask(task)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                                <span className="ml-3 text-sm text-gray-800">{task.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500">No pending tasks found across all projects!</p>}
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
