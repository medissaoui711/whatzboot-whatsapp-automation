import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from './contexts/UserContext';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import { ALL_NAV_ITEMS } from '../data/nav.data';


interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const { user } = useUser();
  const { settings } = useSiteSettings();

  const visibleNavItems = useMemo(() => {
    if (!settings) return [];
    const sectionMap = new Map(settings.sections.map(s => [s.path, s]));

    return ALL_NAV_ITEMS
        .filter(item => {
            const itemSettings = sectionMap.get(item.path);
            return itemSettings?.visible && user && item.roles.includes(user.role);
        })
        .sort((a, b) => {
            const orderA = sectionMap.get(a.path)?.order ?? 99;
            const orderB = sectionMap.get(b.path)?.order ?? 99;
            return orderA - orderB;
        });
  }, [settings, user]);


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
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center mt-4 py-3 px-6 text-dark-text-secondary transition-colors duration-300 transform hover:bg-white/5 hover:text-dark-text-primary ${
                  isActive ? `bg-whatsapp-green/10 ${navLinkBorderClass} border-whatsapp-green text-whatsapp-green font-semibold` : ''
                }`
              }
            >
              <span className="w-6 text-center text-lg flex-shrink-0">{item.icon}</span>
              <span className="mx-4 whitespace-nowrap">{t(item.nameKey)}</span>
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