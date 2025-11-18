import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const ToolsPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Tools</h1>
       <EmptyState
        icon="fa-solid fa-tools"
        title="Marketing Tools Suite"
        description="All our powerful marketing and automation tools will be accessible from here. This feature is currently in development."
      />
    </div>
  );
};

export default ToolsPage;
