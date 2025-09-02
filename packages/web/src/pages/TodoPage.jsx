import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../web/src/api/apiClient.js';
import { FadeIn } from '../components/FadeIn';

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [tasksRes, projectsRes] = await Promise.all([
                apiClient.get('/tasks'),
                apiClient.get('/projects')
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getProjectName = (projectId) => projects.find(p => p.id === projectId)?.name || 'Unknown Project';

    const toggleTask = async (task) => {
        try {
            await apiClient.put(`/tasks/${task.id}`, { isCompleted: !task.isCompleted });
            fetchData(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    const tasksByProject = tasks.reduce((acc, task) => {
        (acc[task.projectId] = acc[task.projectId] || []).push(task);
        return acc;
    }, {});

    if (loading) return <p>Loading all tasks...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Master To-Do List</h1>
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
                </FadeIn>
            </div>
        </div>
    );
}