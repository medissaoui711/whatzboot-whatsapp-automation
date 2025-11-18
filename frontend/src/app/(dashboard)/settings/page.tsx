import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const SettingsPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Settings</h1>
       <EmptyState
        icon="fa-solid fa-cog"
        title="Settings Panel"
        description="Manage your account, billing, team, and application settings here. This feature is under development."
      />
    </div>
  );
};

export default SettingsPage;
