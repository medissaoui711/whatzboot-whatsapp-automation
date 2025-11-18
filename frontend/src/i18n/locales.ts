import React from 'react';

export interface Translation {
  dashboard: string;
  welcomeMessage: (name: string) => React.ReactNode;
}

interface Locales {
  en: Translation;
  ar: Translation;
}

export const locales: Locales = {
  en: {
    dashboard: 'Dashboard',
    welcomeMessage: (name) => `Welcome back, ${name}!`,
  },
  ar: {
    dashboard: 'لوحة التحكم',
    welcomeMessage: (name) => `مرحباً بعودتك، ${name}!`,
  },
};
