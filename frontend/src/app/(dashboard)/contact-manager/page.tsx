import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const ContactManagerPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Contact Manager</h1>
       <EmptyState
        icon="fa-solid fa-address-book"
        title="Contacts Dashboard"
        description="Manage all your contacts, lists, and segments from this page. This feature is currently in development."
      />
    </div>
  );
};

export default ContactManagerPage;
