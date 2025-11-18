import React from 'react';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`rounded-lg border border-dark-border bg-dark-card p-4 shadow-lg md:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-xl font-bold text-dark-text-primary">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
