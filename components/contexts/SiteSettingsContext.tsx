import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { SiteSettings, HeroSettings, SectionSettings } from '../../types';
import { ALL_NAV_ITEMS } from '../../data/nav.data';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  updateHeroSettings: (newHeroSettings: HeroSettings) => void;
  updateSections: (newSections: SectionSettings[]) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
    hero: {
        titleKey: 'dashboard.title',
        subtitleKey: 'dashboard.subtitle',
    },
    sections: ALL_NAV_ITEMS.map((item, index) => ({
        path: item.path,
        visible: true,
        order: index,
    })),
};

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('whatzboot-site-settings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                // Simple validation to ensure stored settings are not malformed
                if (parsedSettings.hero && parsedSettings.sections) {
                    setSettings(parsedSettings);
                } else {
                    setSettings(defaultSettings);
                }
            } else {
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error("Failed to load site settings from localStorage", error);
            setSettings(defaultSettings);
        }
    }, []);

    useEffect(() => {
        if (settings) {
            try {
                localStorage.setItem('whatzboot-site-settings', JSON.stringify(settings));
            } catch (error) {
                console.error("Failed to save site settings to localStorage", error);
            }
        }
    }, [settings]);

    const updateHeroSettings = useCallback((newHeroSettings: HeroSettings) => {
        setSettings(prev => prev ? { ...prev, hero: newHeroSettings } : null);
    }, []);

    const updateSections = useCallback((newSections: SectionSettings[]) => {
        setSettings(prev => prev ? { ...prev, sections: newSections } : null);
    }, []);
    
    const resetSettings = useCallback(() => {
        localStorage.removeItem('whatzboot-site-settings');
        setSettings(defaultSettings);
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, updateHeroSettings, updateSections, resetSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = (): SiteSettingsContextType => {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
};
