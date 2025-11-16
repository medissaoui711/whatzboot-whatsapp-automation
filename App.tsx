import React, { Suspense, lazy, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ToastProvider } from './components/contexts/ToastContext';
import { UserProvider, useUser } from './components/contexts/UserContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import { Role } from './types';

// --- Performance Optimization: Code Splitting with React.lazy ---
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AutoResponder = lazy(() => import('./pages/AutoResponder'));
const GroupManager = lazy(() => import('./pages/GroupManager'));
const Broadcaster = lazy(() => import('./pages/Broadcaster'));
const ContactManager = lazy(() => import('./pages/ContactManager'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NumberFilter = lazy(() => import('./pages/NumberFilter'));
const Settings = lazy(() => import('./pages/Settings'));
const TeamManagement = lazy(() => import('./pages/TeamManagement'));
const Webhooks = lazy(() => import('./pages/Webhooks'));
const Billing = lazy(() => import('./pages/Billing'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const BetaProgram = lazy(() => import('./pages/BetaProgram'));
const AffiliateProgram = lazy(() => import('./pages/AffiliateProgram'));
const TemplateManager = lazy(() => import('./pages/TemplateManager'));

// New Core Features
const TeamInbox = lazy(() => import('./pages/TeamInbox'));
const Automations = lazy(() => import('./pages/Automations'));

// Admin Pages
const MonitoringDashboard = lazy(() => import('./pages/admin/MonitoringDashboard'));


// Lazy load all tool pages
const GoogleMapsExtractor = lazy(() => import('./pages/tools/GoogleMapsExtractor'));
const AutoGroupJoiner = lazy(() => import('./pages/tools/AutoGroupJoiner'));
const GroupFinder = lazy(() => import('./pages/tools/GroupFinder'));
const GroupGenerator = lazy(() => import('./pages/tools/GroupGenerator'));
const SocialMediaExtractor = lazy(() => import('./pages/tools/SocialMediaExtractor'));
const GroupLinkScraper = lazy(() => import('./pages/tools/GroupLinkScraper'));
const ActiveMemberExtractor = lazy(() => import('./pages/tools/ActiveMemberExtractor'));
const ChatListExtractor = lazy(() => import('./pages/tools/ChatListExtractor'));
const GoogleContactsTool = lazy(() => import('./pages/tools/GoogleContactsTool'));
const EmailExtractor = lazy(() => import('./pages/tools/EmailExtractor'));
const AccountWarmup = lazy(() => import('./pages/tools/AccountWarmup'));


const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[calc(100vh-200px)]">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green"></div>
  </div>
);

const InfoPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const pageSlug = location.pathname.substring(1);
  const pageData = t(`info_pages.${pageSlug}`);
  const title = pageData?.title || pageSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const content = pageData?.content || <p className="text-dark-text-secondary">{t('info_pages.default_soon')}</p>;
  return (
     <div>
        <h2 className="text-3xl font-semibold text-dark-text-primary mb-2">{title}</h2>
        <p className="text-dark-text-secondary mb-8">{t('info_pages.default_welcome', { title })}</p>
        {content}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
    const { user } = useUser();
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

function AppContent() {
  const { user } = useUser();

  const infoPagePaths = [
    "/about", "/features", "/pricing", "/faq", "/how-it-works", "/contact",
    "/mission", "/careers", "/privacy", "/terms", "/press", "/blog", "/ai-terms"
  ];
  
  return (
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*"
            element={
              user ? (
                <Layout>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      <Route path="/team-inbox" element={<ProtectedRoute allowedRoles={['Admin', 'Agent']}><TeamInbox /></ProtectedRoute>} />
                      <Route path="/automations" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer']}><Automations /></ProtectedRoute>} />

                      <Route path="/auto-responder" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer', 'Agent']}><AutoResponder /></ProtectedRoute>} />
                      <Route path="/group-manager" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer', 'Agent']}><GroupManager /></ProtectedRoute>} />

                      <Route path="/broadcaster" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer']}><Broadcaster /></ProtectedRoute>} />
                      <Route path="/templates" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer']}><TemplateManager /></ProtectedRoute>} />
                      <Route path="/contact-manager" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer']}><ContactManager /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Admin', 'Marketer']}><Analytics /></ProtectedRoute>} />
                      
                      <Route path="/number-filter" element={<ProtectedRoute allowedRoles={['Admin']}><NumberFilter /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute allowedRoles={['Admin']}><Settings /></ProtectedRoute>} />
                      <Route path="/settings/team" element={<ProtectedRoute allowedRoles={['Admin']}><TeamManagement /></ProtectedRoute>} />
                      <Route path="/settings/webhooks" element={<ProtectedRoute allowedRoles={['Admin']}><Webhooks /></ProtectedRoute>} />
                      <Route path="/settings/billing" element={<ProtectedRoute allowedRoles={['Admin']}><Billing /></ProtectedRoute>} />
                      <Route path="/settings/beta" element={<BetaProgram />} />

                      {/* Admin-only Routes */}
                      <Route path="/admin/monitoring" element={<ProtectedRoute allowedRoles={['Admin']}><MonitoringDashboard /></ProtectedRoute>} />
                      
                      {/* Routes accessible to all logged-in users */}
                      <Route path="/help-center" element={<HelpCenter />} />
                      <Route path="/affiliate-program" element={<AffiliateProgram />} />

                      
                      {infoPagePaths.map(path => (
                          <Route key={path} path={path} element={<InfoPage />} />
                      ))}
                      
                      {/* Allow all roles to access tools for now, can be restricted later */}
                      <Route path="/tools/google-maps-extractor" element={<GoogleMapsExtractor />} />
                      <Route path="/tools/auto-group-joiner" element={<AutoGroupJoiner />} />
                      <Route path="/tools/group-finder" element={<GroupFinder />} />
                      <Route path="/tools/group-generator" element={<GroupGenerator />} />
                      <Route path="/tools/social-media-extractor" element={<SocialMediaExtractor />} />
                      <Route path="/tools/group-link-scraper" element={<GroupLinkScraper />} />
                      <Route path="/tools/active-member-extractor" element={<ActiveMemberExtractor />} />
                      <Route path="/tools/chat-list-extractor" element={<ChatListExtractor />} />
                      <Route path="/tools/google-contacts-tool" element={<GoogleContactsTool />} />
                      <Route path="/tools/email-extractor" element={<EmailExtractor />} />
                      <Route path="/tools/account-warmup" element={<AccountWarmup />} />

                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </HashRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <UserProvider>
          <div className="bg-dark-bg min-h-screen font-sans">
            <AppContent />
          </div>
        </UserProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;