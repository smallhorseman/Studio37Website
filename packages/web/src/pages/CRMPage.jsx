import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const API_URL = import.meta.env.VITE_API_URL;

export default function CRMPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error("No login token found. Please log in.");

            const response = await fetch(`${API_URL}/api/crm/contacts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch contacts');
            setContacts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (loading) return <div className="p-8">Loading contacts...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">CRM Contacts</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {contacts.map(contact => (
                            <li key={contact.id} className="py-2 border-b">
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FadeIn>
    );
}