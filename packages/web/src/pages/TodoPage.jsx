import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import apiClient from '../apiClient.js'; // Import our new API client

export default function TodoPage() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state for robustness

    // This function is now much cleaner and more secure
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Promise.all is still the most efficient way to fetch both resources
            const [tasksRes, projectsRes] = await Promise.all([
                apiClient.get('/tasks'),
                apiClient.get('/projects')
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getProjectName = (projectId) => projects.find(p => p.id === projectId)?.name || 'Unknown Project';

    // This function is also much simpler now
    const toggleTask = async (taskToToggle) => {
        try {
            // Optimistic UI Update: Update the state immediately for a snappy feel
            setTasks(currentTasks =>
                currentTasks.map(task =>
                    task.id === taskToToggle.id ? { ...task, isCompleted: !task.isCompleted } : task
                )
            );
            // The apiClient handles the method, headers, and body conversion
            await apiClient.put(`/tasks/${taskToToggle.id}`, { 
                isCompleted: !taskToToggle.isCompleted 
            });
        } catch (err) {
            // If the API call fails, revert the change and show an error
            setError('Failed to update task. Please try again.');
            console.error(err);
            fetchData(); // Re-fetch to get the true state from the server
        }
    };

    // Grouping logic remains the same
    const tasksByProject = tasks.reduce((acc, task) => {
        (acc[task.projectId] = acc[task.projectId] || []).push(task);
        return acc;
    }, {});

    if (loading) return <div className="p-8">Loading all tasks...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

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
                                            <span className={`ml-3 text-sm text-gray-800 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.text}</span>
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