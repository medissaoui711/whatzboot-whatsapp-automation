import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, children }) => {
  return (
    <div className="flex animate-fade-in-up flex-col items-center justify-center rounded-lg border-2 border-dashed border-dark-border bg-dark-card p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dark-border">
        <i className={`${icon} text-3xl text-whatsapp-green`}></i>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-dark-text-primary">{title}</h3>
      <p className="max-w-sm text-dark-text-secondary">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default EmptyState;
