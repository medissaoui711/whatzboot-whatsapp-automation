
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-dark-border rounded-lg min-h-[300px]">
      <div className="text-6xl text-dark-text-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-dark-text-primary mb-2">{title}</h3>
      <p className="text-dark-text-secondary max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default React.memo(EmptyState);
