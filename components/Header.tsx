import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from './contexts/UserContext';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  openChangelog: () => void;
  onSearchSubmit: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, openChangelog, onSearchSubmit }) => {
  const { t, dir } = useLanguage();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-dark-card border-b border-dark-border flex-shrink-0">
      <div className="flex items-center">
        <button 
            onClick={toggleSidebar} 
            className="text-dark-text-secondary hover:text-dark-text-primary focus:outline-none me-5" 
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'} text-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'rotate-90' : ''}`}></i>
        </button>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 ps-10 pe-4 py-2 text-sm text-dark-text-primary placeholder-dark-text-secondary bg-dark-input border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            placeholder={t('header.searchPlaceholder')}
          />
          <button type="submit" className={`absolute inset-y-0 flex items-center ${dir === 'rtl' ? 'right-0 pe-3' : 'left-0 ps-3'}`}>
            <i className="fa-solid fa-search text-dark-text-secondary"></i>
          </button>
        </form>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button onClick={openChangelog} className="text-dark-text-secondary hover:text-whatsapp-teal-green focus:outline-none" aria-label={t('header.whats_new')}>
          <i className="fa-solid fa-gift text-xl"></i>
        </button>
        <Link to="/help-center" className="text-dark-text-secondary hover:text-whatsapp-teal-green focus:outline-none" aria-label={t('header.help')}>
          <i className="fa-solid fa-circle-question text-xl"></i>
        </Link>
        <button className="flex text-dark-text-secondary hover:text-whatsapp-teal-green focus:outline-none">
          <i className="fa-solid fa-bell text-xl"></i>
        </button>
        <div className="relative">
          {user && (
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user.avatar}
                alt="User avatar"
              />
              <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <h3 className="text-dark-text-primary font-semibold flex items-center">
                    {user.name}
                    {user.betaTester && (
                        <span className="ms-2 text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-2 py-0.5 rounded-md">
                            {t('beta_program.badge_text')}
                        </span>
                    )}
                  </h3>
                  <p className="text-sm text-dark-text-secondary">{t(`roles.${user.role}`)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;