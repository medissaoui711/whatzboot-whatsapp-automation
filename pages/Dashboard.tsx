import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import MessageChart from '../components/MessageChart';
import { DashboardStats, MessageTrend } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import Skeleton from '../components/ui/Skeleton';
import WelcomeModal from '../components/WelcomeModal';

interface ToolCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  buttonText: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, icon, path, buttonText }) => {
  return (
    <div className="bg-dark-card rounded-xl shadow-lg border border-dark-border p-6 flex flex-col items-center text-center hover:shadow-2xl hover:border-whatsapp-green transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-6xl text-dark-text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-md font-semibold text-dark-text-primary mb-5 flex-grow flex items-center justify-center min-h-[4rem]">{title}</h3>
      <Link to={path} className="w-full mt-auto">
        <button className="w-full bg-whatsapp-green text-white font-bold py-2 px-4 rounded-lg hover:bg-whatsapp-teal-green transition-colors flex items-center justify-center">
          {buttonText}
          <i className="fa-solid fa-arrow-up-right-from-square text-xs ms-2"></i>
        </button>
      </Link>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<MessageTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoading(true);

    const hasVisitedBefore = localStorage.getItem('hasVisitedWhatzBoot');
    if (!hasVisitedBefore) {
        setShowWelcome(true);
        localStorage.setItem('hasVisitedWhatzBoot', 'true');
    }

    // Dummy data fetching
    setTimeout(() => {
        setStats({
          messagesSent: 1254,
          activeBots: 8,
          groupsManaged: 23,
          contacts: 4500,
        });
        setTrends([
          { name: 'Mon', sent: 400, received: 240 },
          { name: 'Tue', sent: 300, received: 139 },
          { name: 'Wed', sent: 200, received: 980 },
          { name: 'Thu', sent: 278, received: 390 },
          { name: 'Fri', sent: 189, received: 480 },
          { name: 'Sat', sent: 239, received: 380 },
          { name: 'Sun', sent: 349, received: 430 },
        ]);
        setIsLoading(false);
    }, 1500);
  }, []);

  const allTools = [
    // Existing Features
    { id: 'auto_responder', path: '/auto-responder', icon: <i className="fa-solid fa-robot"></i> },
    { id: 'group_manager', path: '/group-manager', icon: <i className="fa-solid fa-users-gear"></i> },
    { id: 'broadcaster', path: '/broadcaster', icon: <i className="fa-solid fa-bullhorn"></i> },
    { id: 'number_filter', path: '/number-filter', icon: <i className="fa-solid fa-filter-circle-check"></i> },
    
    // New Tools from images
    { id: 'google_maps_extractor', path: '/tools/google-maps-extractor', icon: <i className="fa-solid fa-map-location-dot"></i> },
    { id: 'auto_group_joiner', path: '/tools/auto-group-joiner', icon: <i className="fa-solid fa-person-walking-arrow-right"></i> },
    { id: 'group_finder', path: '/tools/group-finder', icon: <i className="fa-solid fa-magnifying-glass-plus"></i> },
    { id: 'group_generator', path: '/tools/group-generator', icon: <i className="fa-solid fa-user-group"></i> },
    { id: 'social_media_extractor', path: '/tools/social-media-extractor', icon: <i className="fa-solid fa-share-nodes"></i> },
    { id: 'group_link_scraper', path: '/tools/group-link-scraper', icon: <i className="fa-solid fa-link"></i> },
    { id: 'active_member_extractor', path: '/tools/active-member-extractor', icon: <i className="fa-solid fa-user-check"></i> },
    { id: 'chat_list_extractor', path: '/tools/chat-list-extractor', icon: <i className="fa-solid fa-comments"></i> },
    { id: 'google_contacts_tool', path: '/tools/google-contacts-tool', icon: <i className="fa-solid fa-file-csv"></i> },
    { id: 'email_extractor', path: '/tools/email-extractor', icon: <i className="fa-solid fa-at"></i> },
    { id: 'account_warmup', path: '/tools/account-warmup', icon: <i className="fa-solid fa-fire"></i> },
  ];

  return (
    <div>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('dashboard.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('dashboard.subtitle')}</p>
      
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
            <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </>
        ) : stats && (
          <>
            <DashboardCard
              title={t('dashboard.messages_sent')}
              value={stats.messagesSent.toLocaleString()}
              icon={<i className="fa-solid fa-paper-plane text-white text-xl"></i>}
              color="bg-whatsapp-green"
            />
            <DashboardCard
              title={t('dashboard.active_bots')}
              value={stats.activeBots}
              icon={<i className="fa-solid fa-robot text-white text-xl"></i>}
              color="bg-whatsapp-blue"
            />
            <DashboardCard
              title={t('dashboard.groups_managed')}
              value={stats.groupsManaged}
              icon={<i className="fa-solid fa-users text-white text-xl"></i>}
              color="bg-yellow-500"
            />
            <DashboardCard
              title={t('dashboard.total_contacts')}
              value={stats.contacts.toLocaleString()}
              icon={<i className="fa-solid fa-address-book text-white text-xl"></i>}
              color="bg-purple-500"
            />
          </>
        )}
      </div>
      
      {isLoading ? <Skeleton className="mt-8 h-[360px]" /> : <MessageChart data={trends} />}

      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-dark-text-primary mb-6">{t('dashboard.tools_title')}</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allTools.map(tool => (
            <ToolCard 
              key={tool.id}
              title={t(`tools.${tool.id}.title`)}
              icon={tool.icon}
              path={tool.path}
              buttonText={t(`tools.${tool.id}.button`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;