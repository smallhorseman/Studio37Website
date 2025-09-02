import React from 'react';

const ContactActions = ({ contact }) => {
  if (!contact) {
    return <div>No contact selected.</div>;
  }

  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleText = () => {
    window.location.href = `sms:${contact.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <div className="contact-actions space-x-2">
      {contact.phone && (
        <>
          <button onClick={handleCall} className="px-3 py-1 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600">Call</button>
          <button onClick={handleText} className="px-3 py-1 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600">Text</button>
        </>
      )}
      {contact.email && (
        <button onClick={handleEmail} className="px-3 py-1 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600">Email</button>
      )}
      {/* Edit button placeholder - to be implemented on the CRM page */}
      <button className="px-3 py-1 text-sm font-semibold rounded-md bg-yellow-500 text-white hover:bg-yellow-600">Edit</button>
    </div>
  );
};

export default ContactActions;