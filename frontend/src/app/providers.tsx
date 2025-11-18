'use client';

import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UserProvider } from '@/contexts/UserContext';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <UserProvider>
          <SiteSettingsProvider>
            {children}
          </SiteSettingsProvider>
        </UserProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
