import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const TeamInboxPage = () => {
  return (
     <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Team Inbox</h1>
       <EmptyState
        icon="fa-solid fa-inbox"
        title="Team Inbox Coming Soon"
        description="Collaborate with your team to manage all your WhatsApp conversations in one place. This feature is currently in development."
      />
    </div>
  );
};

export default TeamInboxPage;
