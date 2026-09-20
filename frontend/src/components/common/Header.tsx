'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

type HeaderProps = {
  onOpenMobileDrawer?: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
  // Backward compatibility
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
};

const Header: React.FC<HeaderProps> = ({
  onOpenMobileDrawer,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
  setSidebarOpen,
}) => {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleMobileMenuClick = () => {
    if (onOpenMobileDrawer) {
      onOpenMobileDrawer();
    } else if (setSidebarOpen) {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <header
      className={`sticky top-0 z-20 border-b border-dark-border bg-dark-card/90 backdrop-blur-md px-3 sm:px-5 transition-all duration-300 ease-in-out ${
        isDesktopCollapsed ? 'md:px-8 xl:px-10' : 'md:px-5 xl:px-7'
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-2.5 sm:gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/60 text-dark-text-secondary hover:border-whatsapp-green/40 hover:text-dark-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green"
            aria-controls="mobile-drawer"
            aria-label="فتح القائمة الرئيسية"
            onClick={handleMobileMenuClick}
            title="فتح القائمة"
          >
            <i className="fa-solid fa-bars-staggered text-base"></i>
          </button>

          {/* Mini mobile brand */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <span className="text-sm font-extrabold text-white">Whatz<span className="text-whatsapp-green">Boot</span></span>
          </div>
        </div>

        {/* WhatsApp Device Connection Status */}
        <div className="hidden md:flex items-center gap-2.5 rounded-full border border-dark-border/80 bg-dark-bg/70 px-3.5 py-1.5 text-xs shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp-green opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-whatsapp-green"></span>
          </span>
          <span className="font-semibold text-whatsapp-green">متصل برقم:</span>
          <span className="font-mono text-dark-text-secondary text-[11px]" dir="ltr">
            +966 50 829 4410
          </span>
        </div>

        {/* Header content - Commerce metrics banner */}
        <div className="flex-1 flex items-center justify-end sm:justify-start sm:px-2 md:px-4 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 sm:px-3 py-1 text-xs text-amber-300 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
            <span className="hidden sm:inline font-medium text-[11px] sm:text-xs whitespace-nowrap">مبيعات اليوم:</span>
            <span className="font-extrabold font-mono text-white text-xs sm:text-sm whitespace-nowrap">3,420 ر.س</span>
            <span className="hidden xl:inline-block text-[10px] text-amber-400/80 whitespace-nowrap">(+18.4% ↗)</span>
          </div>
        </div>

        {/* Quick notification & user controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Settings Gear Quick Action - only on mobile */}
          <button
            type="button"
            onClick={() => {
              if (onOpenMobileDrawer) {
                onOpenMobileDrawer();
              } else {
                router.push('/settings');
              }
            }}
            className="md:hidden relative flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/60 text-dark-text-secondary hover:text-amber-400 hover:border-amber-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="ترس الإعدادات"
            title="إعدادات النظام والمتجر"
          >
            <i className="fa-solid fa-gear text-sm"></i>
          </button>

          {/* Quick notification icon */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/60 text-dark-text-secondary hover:text-dark-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green"
            aria-label="الإشعارات (3 جديدة)"
          >
            <i className="fa-regular fa-bell text-sm"></i>
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-whatsapp-green text-[9px] font-bold text-black">
              3
            </span>
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-dark-border bg-dark-bg/60 py-1 px-1.5 sm:px-3">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-dark-border ring-1 ring-dark-border">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-whatsapp-green">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
              </div>

              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-dark-text-primary truncate max-w-[100px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-whatsapp-green font-medium">
                  مدير النظام
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-dark-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <i className="fa-solid fa-right-from-bracket text-xs"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
