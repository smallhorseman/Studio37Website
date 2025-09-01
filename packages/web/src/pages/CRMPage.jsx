import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import apiClient from '../apiClient.js'; // Import our new API client

export default function CRMPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This function is now much cleaner!
    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // The apiClient automatically adds the auth token and base URL.
            const response = await apiClient.get('/crm/contacts');
            // With Axios, the JSON data is directly on the `data` property.
            setContacts(response.data);
        } catch (error) {
            // The apiClient also provides better error details.
            setError(error.response?.data?.message || error.message);
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