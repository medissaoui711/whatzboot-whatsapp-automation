'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DeviceOS = 'ios' | 'android';
export type DeviceThemeMode = 'auto' | 'ios' | 'android';

interface DeviceThemeContextType {
  themeMode: DeviceThemeMode;
  resolvedOS: DeviceOS;
  setThemeMode: (mode: DeviceThemeMode) => void;
  isTouchDevice: boolean;
}

const DeviceThemeContext = createContext<DeviceThemeContextType | undefined>(undefined);

export const useDeviceTheme = () => {
  const context = useContext(DeviceThemeContext);
  if (!context) {
    throw new Error('useDeviceTheme must be used within a DeviceThemeProvider');
  }
  return context;
};

export const DeviceThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<DeviceThemeMode>('auto');
  const [detectedOS, setDetectedOS] = useState<DeviceOS>('android');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 1. Detect device OS
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      const isIOS =
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      setDetectedOS(isIOS ? 'ios' : 'android');
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

      // Load persisted preference if available
      try {
        const saved = localStorage.getItem('whatzboot-device-theme') as DeviceThemeMode | null;
        if (saved && ['auto', 'ios', 'android'].includes(saved)) {
          setThemeModeState(saved);
        }
      } catch {
        // Ignore localStorage error
      }
    }
  }, []);

  const setThemeMode = (mode: DeviceThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('whatzboot-device-theme', mode);
    } catch {
      // Ignore
    }
  };

  const resolvedOS: DeviceOS = themeMode === 'auto' ? detectedOS : themeMode;

  return (
    <DeviceThemeContext.Provider
      value={{
        themeMode,
        resolvedOS,
        setThemeMode,
        isTouchDevice,
      }}
    >
      {children}
    </DeviceThemeContext.Provider>
  );
};
