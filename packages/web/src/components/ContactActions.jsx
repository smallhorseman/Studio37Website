import React from 'react';

const ContactActions = ({ contact }) => {
  if (!contact) {
    return <div className="text-center text-gray-500 py-4">No contact selected.</div>;
  }

  const handleCall = () => window.location.href = `tel:${contact.phone}`;
  const handleText = () => window.location.href = `sms:${contact.phone}`;
  const handleEmail = () => window.location.href = `mailto:${contact.email}`;

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {contact.phone && (
        <>
          <button onClick={handleCall} className="px-4 py-2 text-sm font-semibold rounded bg-blue-500 text-white hover:bg-blue-600 transition">Call</button>
          <button onClick={handleText} className="px-4 py-2 text-sm font-semibold rounded bg-green-500 text-white hover:bg-green-600 transition">Text</button>
        </>
      )}
      {contact.email && (
        <button onClick={handleEmail} className="px-4 py-2 text-sm font-semibold rounded bg-red-500 text-white hover:bg-red-600 transition">Email</button>
      )}
      <button className="px-4 py-2 text-sm font-semibold rounded bg-yellow-500 text-white hover:bg-yellow-600 transition">Edit</button>
    </div>
  );
};

export default ContactActions;