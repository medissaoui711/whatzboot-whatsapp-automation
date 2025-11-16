import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from './contexts/UserContext';
import { Role } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const { user } = useUser();

  const ALL_NAV_ITEMS = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: <i className="fa-solid fa-tachometer-alt"></i>, roles: ['Admin', 'Marketer', 'Agent'] },
    { name: t('nav.team_inbox'), path: '/team-inbox', icon: <i className="fa-solid fa-inbox"></i>, roles: ['Admin', 'Agent'] },
    { name: t('nav.automations'), path: '/automations', icon: <i className="fa-solid fa-gears"></i>, roles: ['Admin', 'Marketer'] },
    { name: t('nav.auto_responder'), path: '/auto-responder', icon: <i className="fa-solid fa-robot"></i>, roles: ['Admin', 'Marketer', 'Agent'] },
    { name: t('nav.broadcaster'), path: '/broadcaster', icon: <i className="fa-solid fa-bullhorn"></i>, roles: ['Admin', 'Marketer'] },
    { name: t('nav.template_manager'), path: '/templates', icon: <i className="fa-solid fa-layer-group"></i>, roles: ['Admin', 'Marketer'] },
    { name: t('nav.contact_manager'), path: '/contact-manager', icon: <i className="fa-solid fa-address-book"></i>, roles: ['Admin', 'Marketer'] },
    { name: t('nav.group_manager'), path: '/group-manager', icon: <i className="fa-solid fa-users"></i>, roles: ['Admin', 'Marketer', 'Agent'] },
    { name: t('nav.analytics'), path: '/analytics', icon: <i className="fa-solid fa-chart-line"></i>, roles: ['Admin', 'Marketer'] },
    { name: t('nav.number_filter'), path: '/number-filter', icon: <i className="fa-solid fa-filter"></i>, roles: ['Admin'] },
    { name: t('nav.settings'), path: '/settings', icon: <i className="fa-solid fa-cog"></i>, roles: ['Admin'] },
  ];

  const visibleNavItems = ALL_NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  const sidebarClasses = dir === 'rtl' 
    ? `fixed top-0 right-0 z-30 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`
    : `fixed top-0 left-0 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`;
  
  const borderClass = dir === 'rtl' ? 'border-l' : 'border-r';
  const navLinkBorderClass = dir === 'rtl' ? 'border-l-4' : 'border-r-4';
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <aside className={`bg-dark-card shadow-lg ${borderClass} border-dark-border flex flex-col w-64 h-screen transition-[transform,opacity] duration-500 ease-in-out ${sidebarClasses} ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center h-20 border-b border-dark-border flex-shrink-0 px-6`}>
            <i className="fa-brands fa-whatsapp text-3xl text-whatsapp-green flex-shrink-0"></i>
            <h1 className="text-2xl font-bold text-white ms-2 whitespace-nowrap">
                {t('whatzboot')}
            </h1>
        </div>
        <nav className={`mt-5 flex-grow overflow-y-auto overflow-x-hidden ${textAlignmentClass}`}>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center mt-4 py-3 px-6 text-dark-text-secondary transition-colors duration-300 transform hover:bg-white/5 hover:text-dark-text-primary ${
                  isActive ? `bg-whatsapp-green/10 ${navLinkBorderClass} border-whatsapp-green text-whatsapp-green font-semibold` : ''
                }`
              }
            >
              <span className="w-6 text-center text-lg flex-shrink-0">{item.icon}</span>
              <span className="mx-4 whitespace-nowrap">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-6 mb-4">
          <label htmlFor="language-select" className={`block text-sm font-medium text-dark-text-secondary mb-2 ${textAlignmentClass}`}>
            {t('sidebar.select_language')}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
            className={`w-full p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        
        <div className="flex-shrink-0 p-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
              <h3 className="font-bold text-whatsapp-green">{t('sidebar.upgradeTitle')}</h3>
              <p className="text-sm text-dark-text-secondary mt-2">{t('sidebar.upgradeDescription')}</p>
              <button className="mt-4 w-full bg-whatsapp-green text-white font-bold py-2 px-4 rounded-lg hover:bg-whatsapp-teal-green transition-colors">
                  {t('sidebar.upgradeButton')}
              </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;