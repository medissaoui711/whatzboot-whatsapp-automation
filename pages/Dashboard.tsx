import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';

import DashboardCard from '../components/DashboardCard';
import MessageChart from '../components/MessageChart';
import { DashboardStats, MessageTrend } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import Skeleton from '../components/ui/Skeleton';
import WelcomeModal from '../components/WelcomeModal';
import { useSiteSettings } from '../components/contexts/SiteSettingsContext';
import Card from '../components/ui/Card';
import { ALL_TOOLS } from '../data/tools.data';
import ToolLink from '../components/ui/ToolLink';
import Button from '../components/ui/Button';
import { useUser } from '../components/contexts/UserContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WidgetWrapper: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => {
    return (
        <Card className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
            <h3 className="text-xl font-semibold text-dark-text-primary mb-4 flex-shrink-0 cursor-move drag-handle flex items-center">
                <i className="fa-solid fa-grip-vertical mr-3 text-dark-text-secondary"></i>
                {title}
            </h3>
            <div className="flex-grow overflow-hidden">
                {children}
            </div>
        </Card>
    );
};

const QuickActionButton: React.FC<{ title: string; icon: React.ReactNode; path: string; }> = ({ title, icon, path }) => {
  return (
    <Link to={path} className="bg-dark-bg rounded-xl border border-dark-border p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-whatsapp-green transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-4xl text-whatsapp-green mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-dark-text-primary flex-grow flex items-center">{title}</h3>
    </Link>
  );
};


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<MessageTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const { t, dir } = useLanguage();
  const { settings } = useSiteSettings();
  const { user } = useUser();

  const initialLayouts = {
      lg: [
        { i: 'stats', x: 0, y: 0, w: 12, h: 4, minW: 12, minH: 4, maxH: 4 },
        { i: 'chart', x: 0, y: 4, w: 6, h: 10, minW: 5, minH: 8 },
        { i: 'quick-actions', x: 6, y: 4, w: 3, h: 10, minW: 2, minH: 8 },
        { i: 'tools', x: 9, y: 4, w: 3, h: 10, minW: 3, minH: 8 },
      ],
      md: [
        { i: 'stats', x: 0, y: 0, w: 10, h: 4, minW: 10, minH: 4, maxH: 4 },
        { i: 'chart', x: 0, y: 4, w: 10, h: 9, minW: 6, minH: 8 },
        { i: 'quick-actions', x: 0, y: 13, w: 5, h: 10, minW: 4, minH: 8 },
        { i: 'tools', x: 5, y: 13, w: 5, h: 10, minW: 4, minH: 8 },
      ]
  };

  const [layouts, setLayouts] = useState(() => {
    try {
        const savedLayouts = localStorage.getItem('dashboard-layouts');
        if (savedLayouts) {
            const parsedLayouts = JSON.parse(savedLayouts);
            // Check if all essential widgets are present. If not, reset.
            const essentialWidgets = ['stats', 'chart', 'tools', 'quick-actions'];
            const allWidgetsPresent = essentialWidgets.every(widgetId => 
                parsedLayouts.lg?.find((layout: any) => layout.i === widgetId)
            );
            if (allWidgetsPresent) {
                return parsedLayouts;
            }
        }
    } catch (error) {
        console.error("Could not parse dashboard layouts from localStorage", error);
    }
    return initialLayouts;
  });

  const onLayoutChange = (layout: any, allLayouts: any) => {
    localStorage.setItem('dashboard-layouts', JSON.stringify(allLayouts));
    setLayouts(allLayouts);
  };

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

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return t('dashboard.greeting_morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      return t('dashboard.greeting_afternoon');
    } else {
      return t('dashboard.greeting_evening');
    }
  };

  return (
    <div>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-dark-text-primary">
          {getGreeting()}, <span className="font-bold text-whatsapp-green">{user?.name}</span>
        </h2>
        <p className="mt-2 text-dark-text-secondary">{settings ? t(settings.hero.subtitleKey) : t('dashboard.subtitle')}</p>
      </div>
      
      <ResponsiveGridLayout
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        draggableHandle=".drag-handle"
      >
        <div key="stats">
            <WidgetWrapper title={t('dashboard.overview_title')}>
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </div>
                ) : stats && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    </div>
                )}
            </WidgetWrapper>
        </div>
        <div key="chart">
            <WidgetWrapper title={t('dashboard.message_activity')}>
                 {isLoading ? <Skeleton className="w-full h-full min-h-[250px]" /> : <MessageChart data={trends} />}
            </WidgetWrapper>
        </div>
        <div key="quick-actions">
            <WidgetWrapper title={t('dashboard.quick_actions_title')}>
                 <div className="grid grid-cols-2 gap-4 h-full">
                    <QuickActionButton 
                      title={t('dashboard.quick_actions_broadcast')}
                      icon={<i className="fa-solid fa-paper-plane"></i>}
                      path="/broadcaster"
                    />
                     <QuickActionButton 
                      title={t('dashboard.quick_actions_autobot')}
                      icon={<i className="fa-solid fa-robot"></i>}
                      path="/auto-responder"
                    />
                     <QuickActionButton 
                      title={t('dashboard.quick_actions_add_contact')}
                      icon={<i className="fa-solid fa-user-plus"></i>}
                      path="/contact-manager"
                    />
                     <QuickActionButton 
                      title={t('dashboard.quick_actions_view_inbox')}
                      icon={<i className="fa-solid fa-inbox"></i>}
                      path="/team-inbox"
                    />
                </div>
            </WidgetWrapper>
        </div>
        <div key="tools">
            <WidgetWrapper title={t('dashboard.tools_title')}>
                <div className="flex flex-col h-full">
                    <div className="space-y-3 flex-grow overflow-y-auto -mr-3 pr-3">
                        {ALL_TOOLS.slice(0, 5).map(tool => (
                            <ToolLink 
                                key={tool.id}
                                title={t(`tools.${tool.id}.title`)}
                                icon={tool.icon}
                                path={tool.path}
                            />
                        ))}
                    </div>
                    <div className="mt-auto pt-4 flex-shrink-0">
                        <Link to="/tools" className="w-full block">
                            <Button variant="secondary" className="w-full">
                                {t('dashboard.view_all_tools')}
                                <i className={`fa-solid ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ml-2`}></i>
                            </Button>
                        </Link>
                    </div>
                </div>
            </WidgetWrapper>
        </div>
      </ResponsiveGridLayout>

    </div>
  );
};

export default Dashboard;