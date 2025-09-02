import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../apiClient.js';
import { FadeIn } from '../components/FadeIn';

export default function CRMPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/crm/contacts');
            setContacts(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleText = (phone) => {
        window.location.href = `sms:${phone}`;
    };

    const handleEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleEdit = (contactId) => {
        // Here you would implement the logic to open an edit form
        console.log('Edit contact:', contactId);
    };

    if (loading) return <div className="p-8">Loading contacts...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <FadeIn>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">CRM Contacts</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <ul>
                        {contacts.map(contact => (
                            <li key={contact.id} className="py-4 border-b flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                </div>
                                <div className="space-x-2">
                                    {contact.phone && (
                                        <>
                                            <button onClick={() => handleCall(contact.phone)} className="px-3 py-1 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600">Call</button>
                                            <button onClick={() => handleText(contact.phone)} className="px-3 py-1 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600">Text</button>
                                        </>
                                    )}
                                    {contact.email && (
                                        <button onClick={() => handleEmail(contact.email)} className="px-3 py-1 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600">Email</button>
                                    )}
                                    <button onClick={() => handleEdit(contact.id)} className="px-3 py-1 text-sm font-semibold rounded-md bg-yellow-500 text-white hover:bg-yellow-600">Edit</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FadeIn>
    );
}