import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Layouts
import AuthLayout from '@/app/(auth)/layout';
import DashboardLayout from '@/app/(dashboard)/layout';

// Pages
import LoginPage from '@/app/(auth)/login/page';
import RegisterPage from '@/app/(auth)/register/page';
import DashboardPage from '@/app/(dashboard)/page';
import OrdersPage from '@/app/(dashboard)/orders/page';
import TeamInboxPage from '@/app/(dashboard)/team-inbox/page';
import BroadcasterPage from '@/app/(dashboard)/send-message/page';
import AutomationsPage from '@/app/(dashboard)/automations/page';
import ContactManagerPage from '@/app/(dashboard)/contact-manager/page';
import AnalyticsPage from '@/app/(dashboard)/analytics/page';
import ToolsPage from '@/app/(dashboard)/tools/page';
import SettingsPage from '@/app/(dashboard)/settings/page';
import VoiceAgentPage from '@/app/(dashboard)/voice-agent/page';
import WhatsAppGroupsPage from '@/app/(dashboard)/groups/page';

import AppProviders from '@/app/providers';
import { RouterProvider, usePathname } from '@/compat/Navigation';

function AppContent() {
  const pathname = usePathname();

  // Match routes
  if (pathname === '/login') {
    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    );
  }

  if (pathname === '/register') {
    return (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    );
  }

  // Dashboard routes
  let pageComponent = <DashboardPage />;

  if (pathname === '/voice-agent') {
    pageComponent = <VoiceAgentPage />;
  } else if (pathname === '/groups') {
    pageComponent = <WhatsAppGroupsPage />;
  } else if (pathname === '/orders') {
    pageComponent = <OrdersPage />;
  } else if (pathname === '/team-inbox') {
    pageComponent = <TeamInboxPage />;
  } else if (pathname === '/send-message') {
    pageComponent = <BroadcasterPage />;
  } else if (pathname === '/automations') {
    pageComponent = <AutomationsPage />;
  } else if (pathname === '/contact-manager') {
    pageComponent = <ContactManagerPage />;
  } else if (pathname === '/analytics') {
    pageComponent = <AnalyticsPage />;
  } else if (pathname === '/tools') {
    pageComponent = <ToolsPage />;
  } else if (pathname === '/settings') {
    pageComponent = <SettingsPage />;
  } else if (pathname === '/') {
    pageComponent = <DashboardPage />;
  } else {
    pageComponent = <DashboardPage />;
  }

  return (
    <DashboardLayout>
      {pageComponent}
    </DashboardLayout>
  );
}

function Root() {
  return (
    <RouterProvider>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </RouterProvider>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Root />);
}
