import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const BroadcasterPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Send Message</h1>
      <EmptyState
        icon="fa-solid fa-bullhorn"
        title="Broadcaster Feature"
        description="This is where you'll be able to send bulk messages to your contacts and groups. The full feature is under construction."
      />
    </div>
  );
};

export default BroadcasterPage;
