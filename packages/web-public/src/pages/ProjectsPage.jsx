// packages/web-public/src/pages/ProjectsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const backendUrl = 'https://sem37-api.onrender.com';

// New Project Modal Component
const NewProjectModal = ({ contacts, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [contactId, setContactId] = useState('');

    const handleSave = () => {
        if (!name || !contactId) {
            alert('Please fill out all fields.');
            return;
        }
        onSave({ name, contactId, status: 'To Do', dateCreated: new Date().toISOString() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link to Client</label>
                        <select value={contactId} onChange={e => setContactId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="">Select a client...</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Create Project</button>
                </div>
            </div>
        </div>
    );
};

// Project Card Component for the Kanban Board
const ProjectCard = ({ project, contactName }) => (
    <div className="bg-white p-4 rounded-md shadow-sm border">
        <h4 className="font-bold text-gray-800">{project.name}</h4>
        <p className="text-sm text-gray-500 mt-1">Client: {contactName}</p>
        <p className="text-xs text-gray-400 mt-2">Created: {new Date(project.dateCreated).toLocaleDateString()}</p>
    </div>
);

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [projRes, contRes] = await Promise.all([
                fetch(`${backendUrl}/api/projects`),
                fetch(`${backendUrl}/api/crm/contacts`)
            ]);
            if (!projRes.ok || !contRes.ok) throw new Error('Failed to fetch data.');
            const projData = await projRes.json();
            const contData = await contRes.json();
            setProjects(projData);
            setContacts(contData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveProject = async (projectData) => {
        try {
            const response = await fetch(`${backendUrl}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            if (!response.ok) throw new Error('Failed to create project.');
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };
    
    const getContactName = (contactId) => contacts.find(c => c.id === contactId)?.name || 'N/A';
    
    const todoProjects = projects.filter(p => p.status === 'To Do');
    const inProgressProjects = projects.filter(p => p.status === 'In Progress');
    const doneProjects = projects.filter(p => p.status === 'Done');

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            {isModalOpen && <NewProjectModal contacts={contacts} onClose={() => setIsModalOpen(false)} onSave={handleSaveProject} />}
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-bold text-gray-800">Project Management</h1>
                        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
                            + New Project
                        </button>
                    </div>
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {loading ? <p className="text-center">Loading projects...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-200 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700">To Do ({todoProjects.length})</h3>
                                <div className="space-y-4">
                                    {todoProjects.map(p => <ProjectCard key={p.id} project={p} contactName={getContactName(p.contactId)} />)}
                                </div>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-blue-800">In Progress ({inProgressProjects.length})</h3>
                                <div className="space-y-4">
                                    {inProgressProjects.map(p => <ProjectCard key={p.id} project={p} contactName={getContactName(p.contactId)} />)}
                                </div>
                            </div>
                             <div className="bg-green-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-green-800">Done ({doneProjects.length})</h3>
                                <div className="space-y-4">
                                    {doneProjects.map(p => <ProjectCard key={p.id} project={p} contactName={getContactName(p.contactId)} />)}
                                </div>
                            </div>
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}

