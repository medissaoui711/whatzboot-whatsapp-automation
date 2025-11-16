import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  const { dir } = useLanguage();
  return (
    <div className={`bg-dark-card rounded-xl shadow-lg border border-dark-border p-6 hover:shadow-2xl transition-shadow duration-300 ${dir === 'rtl' ? 'text-right' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;