'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { locales, Translation } from '../i18n/locales';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translation;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const storedLang = localStorage.getItem('whatzboot-lang') as Language | null;
    if (storedLang && ['en', 'ar'].includes(storedLang)) {
        setLanguage(storedLang);
    } else {
        const browserLang = navigator.language.split('-')[0] as Language;
        if (browserLang === 'ar') {
          setLanguage('ar');
        }
    }
  }, []);

  useEffect(() => {
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.lang = language;
    document.documentElement.dir = newDirection;
    localStorage.setItem('whatzboot-lang', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations: locales[language],
    direction,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
