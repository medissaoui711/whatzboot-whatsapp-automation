
import React, { forwardRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }, ref) => {
  const { dir } = useLanguage();
  return (
    <div 
      ref={ref}
      className={`bg-dark-card rounded-xl shadow-lg border border-dark-border p-6 hover:shadow-2xl transition-shadow duration-300 ${dir === 'rtl' ? 'text-right' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default React.memo(Card);
