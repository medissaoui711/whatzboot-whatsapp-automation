import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const AutomationsPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Automations</h1>
       <EmptyState
        icon="fa-solid fa-robot"
        title="Automation Hub"
        description="Create powerful auto-responders and automated workflows here. This feature is under development."
      />
    </div>
  );
};

export default AutomationsPage;
