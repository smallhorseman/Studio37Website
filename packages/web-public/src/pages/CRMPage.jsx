// packages/web-public/src/pages/CRMPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';

const backendUrl = 'https://sem37-api.onrender.com';

// --- EDIT CONTACT MODAL ---
const EditContactModal = ({ contact, onClose, onSave }) => {
    const [formData, setFormData] = useState(contact);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSave = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Edit Contact</h2>
                <form onSubmit={handleSave}>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700">Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Phone</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Status</label><select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"><option>New</option><option>Contacted</option><option>Proposal</option><option>Won</option><option>Lost</option></select></div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button><button type="submit" className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save Changes</button></div>
                </form>
            </div>
        </div>
    );
};

// --- COMMUNICATION LOG MODAL ---
const ContactDetailModal = ({ contact, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [newLog, setNewLog] = useState('');
    const [logType, setLogType] = useState('Call');
    const fetchLogs = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/crm/contacts/${contact.id}/logs`);
            if (!response.ok) return;
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
    }, [contact.id]);
    useEffect(() => { fetchLogs(); }, [fetchLogs]);
    const handleAddLog = async (e) => {
        e.preventDefault();
        const logData = { type: logType, notes: newLog, timestamp: new Date().toISOString() };
        await fetch(`${backendUrl}/api/crm/contacts/${contact.id}/logs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(logData) });
        setNewLog('');
        fetchLogs();
    };
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">{contact.name}</h2><button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Add Communication Log</h3>
                        <form onSubmit={handleAddLog} className="space-y-3"><select value={logType} onChange={e => setLogType(e.target.value)} className="w-full rounded-md border-gray-300"><option>Call</option><option>Email</option><option>Text</option><option>Meeting</option></select><textarea value={newLog} onChange={e => setNewLog(e.target.value)} rows="4" placeholder="Add notes..." className="w-full rounded-md border-gray-300"></textarea><button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">Add Log</button></form>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        <h3 className="font-semibold mb-2">History</h3>
                        <div className="space-y-3">{logs.length > 0 ? logs.map(log => (<div key={log.id} className="bg-gray-50 p-3 rounded-md border"><p className="text-sm font-medium">{log.type} on {new Date(log.timestamp).toLocaleDateString()}</p><p className="text-sm text-gray-600">{log.notes}</p></div>)) : <p className="text-sm text-gray-500">No logs found.</p>}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN CRM PAGE COMPONENT ---
export default function CRMPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');

  const fetchContacts = useCallback(async () => {
    try { setLoading(true); setError(null); const response = await fetch(`${backendUrl}/api/crm/contacts`); if (!response.ok) throw new Error('Failed to fetch contacts.'); const data = await response.json(); setContacts(data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchContacts(); }, [fetchContacts]);
  const handleAddContact = async (e) => {
    e.preventDefault();
    const newContact = { name, email, phone, status, dateAdded: new Date().toISOString() };
    try {
      const response = await fetch(`${backendUrl}/api/crm/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newContact) });
      if (!response.ok) throw new Error('Failed to add contact.');
      setName(''); setEmail(''); setPhone(''); setStatus('New');
      fetchContacts();
    } catch (err) { setError(`Error: ${err.message}`); }
  };
  const handleUpdateContact = async (updatedContact) => {
    try {
        const { id, ...contactData } = updatedContact;
        const response = await fetch(`${backendUrl}/api/crm/contacts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactData) });
        if (!response.ok) throw new Error('Failed to update contact.');
        setIsEditModalOpen(false);
        fetchContacts();
    } catch (err) { setError(`Error: ${err.message}`); }
  };
  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
        try {
            const response = await fetch(`${backendUrl}/api/crm/contacts/${contactId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete contact.');
            fetchContacts();
        } catch (err) { setError(`Error: ${err.message}`); }
    }
  };
  const openEditModal = (contact) => { setSelectedContact(contact); setIsEditModalOpen(true); };
  const openDetailModal = (contact) => { setSelectedContact(contact); setIsDetailModalOpen(true); };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
        {isEditModalOpen && <EditContactModal contact={selectedContact} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateContact} />}
        {isDetailModalOpen && <ContactDetailModal contact={selectedContact} onClose={() => setIsDetailModalOpen(false)} />}
        <div className="max-w-7xl mx-auto">
            <FadeIn>
                <h1 className="text-4xl font-bold text-gray-800">Client & Lead Management</h1>
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Add New Lead</h2>
                    <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div><label className="block text-sm font-medium text-gray-700">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Phone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Status</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"><option>New</option><option>Contacted</option><option>Proposal</option><option>Won</option><option>Lost</option></select></div>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 h-10">Add Contact</button>
                    </form>
                </div>
                <div className="mt-8 bg-white rounded-lg shadow overflow-x-auto">
                    <div className="p-6"><h2 className="text-2xl font-semibold text-gray-700">Contact List</h2></div>
                    {loading && <p className="p-6">Loading...</p>}
                    {error && <p className="p-6 text-red-500">{error}</p>}
                    {!loading && !error && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => openDetailModal(contact)} className="text-indigo-600 hover:underline">{contact.name}</button></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><div>{contact.email}</div><div className="text-gray-500">{contact.phone}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-indigo-600">Email</a>
                                            <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-green-600">Call</a>
                                            <a href={`sms:${contact.phone}`} className="text-gray-600 hover:text-blue-600">Text</a>
                                            <button onClick={() => openEditModal(contact)} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                                            <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </FadeIn>
        </div>
    </div>
  );
}

