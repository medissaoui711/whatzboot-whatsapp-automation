import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../i18n/LanguageContext';
import FeedbackModal from './FeedbackModal';
import ChangelogModal from './ChangelogModal';
import { Update } from '../types';
import GlobalSearchModal from './GlobalSearchModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const { dir, t } = useLanguage();
  const location = useLocation();

  const updates: Update[] = t('changelog.updates');
  const LATEST_VERSION = updates.length > 0 ? updates[0].version : null;

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('whatzboot-changelog-version');
    if (LATEST_VERSION && lastSeenVersion !== LATEST_VERSION) {
      setIsChangelogOpen(true);
    }
  }, [LATEST_VERSION]);

  // --- Keyboard Shortcut for Global Search ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setGlobalSearchQuery(''); // Clear previous query
        setIsGlobalSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseChangelog = () => {
    setIsChangelogOpen(false);
    if (LATEST_VERSION) {
      localStorage.setItem('whatzboot-changelog-version', LATEST_VERSION);
    }
  };
  
  const openGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    setIsGlobalSearchOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-dark-bg">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div 
          className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out ${
            isSidebarOpen 
              ? (dir === 'rtl' ? 'mr-64' : 'ml-64') 
              : (dir === 'rtl' ? 'mr-0' : 'ml-0')
          }`}
        >
          <Header 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
            openChangelog={() => setIsChangelogOpen(true)}
            onSearchSubmit={openGlobalSearch}
          />
          <main id="main-content" role="main" className="flex-1 overflow-x-hidden overflow-y-auto">
            <div key={location.pathname} className="container mx-auto px-6 py-8 animate-fade-in-up">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
       <button
        onClick={() => setIsFeedbackModalOpen(true)}
        className={`fixed bottom-10 z-50 bg-whatsapp-blue text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-whatsapp-blue ${dir === 'rtl' ? 'left-10' : 'right-10'}`}
        aria-label={t('feedback.button_tooltip')}
        title={t('feedback.button_tooltip') as string}
      >
        <i className="fa-solid fa-lightbulb text-2xl"></i>
      </button>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={handleCloseChangelog}
      />
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        query={globalSearchQuery}
      />
    </>
  );
};

export default Layout;