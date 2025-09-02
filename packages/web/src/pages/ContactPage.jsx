import React from 'react';

export default function ContactPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Contact</h1>
        <p className="page-subtitle">Reach out for bookings & inquiries.</p>
      </div>
      <form className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea rows={5} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-faded-teal" />
        </div>
        <button type="submit" className="btn-primary">Send</button>
      </form>
    </>
  );
}