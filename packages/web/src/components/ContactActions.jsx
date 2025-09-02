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
    <div className="contact-actions">
      <h2>Contact Actions</h2>
      <p>Name: {contact.name}</p>
      <p>Phone: {contact.phone}</p>
      <p>Email: {contact.email}</p>
      <button onClick={handleCall}>Call</button>
      <button onClick={handleText}>Text</button>
      <button onClick={handleEmail}>Email</button>
      {/* You would add an edit button here that opens a form */}
    </div>
  );
};

export default ContactActions;