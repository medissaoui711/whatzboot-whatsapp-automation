
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

interface ToolLinkProps {
  icon: React.ReactNode;
  title: string;
  path: string;
}

const ToolLink: React.FC<ToolLinkProps> = ({ icon, title, path }) => {
    const { dir } = useLanguage();
    return (
        <Link to={path} className="flex items-center p-3 bg-dark-input rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-dark-border">
            <span className="text-xl text-whatsapp-green">{icon}</span>
            <span className={`font-semibold text-dark-text-primary ${dir === 'rtl' ? 'mr-4' : 'ml-4'}`}>{title}</span>
            <i className={`fa-solid fa-arrow-right text-dark-text-secondary ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}></i>
        </Link>
    )
}

export default React.memo(ToolLink);
