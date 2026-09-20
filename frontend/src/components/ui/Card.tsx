import React from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-dark-border bg-dark-card/95 backdrop-blur-sm p-4 sm:p-5 shadow-sm transition-all duration-200 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-dark-border/40 pb-3">
          <div>
            {title && <h2 className="text-base sm:text-lg font-bold text-dark-text-primary tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-dark-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
