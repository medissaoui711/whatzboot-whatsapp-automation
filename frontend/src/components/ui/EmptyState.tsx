import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, children }) => {
  return (
    <div className="flex animate-fade-in-up flex-col items-center justify-center rounded-2xl border border-dashed border-dark-border/80 bg-dark-card/60 p-8 sm:p-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp-green/10 border border-whatsapp-green/20">
        <i className={`${icon} text-2xl text-whatsapp-green`}></i>
      </div>
      <h3 className="mb-1.5 text-base sm:text-lg font-bold text-dark-text-primary tracking-tight">{title}</h3>
      <p className="max-w-md text-xs sm:text-sm text-dark-text-secondary leading-relaxed">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
};

export default EmptyState;
