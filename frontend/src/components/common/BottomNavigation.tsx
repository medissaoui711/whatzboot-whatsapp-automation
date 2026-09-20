'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDeviceTheme } from '@/contexts/DeviceThemeContext';

interface BottomNavigationProps {
  onOpenDrawer: () => void;
  isDrawerOpen?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onOpenDrawer, isDrawerOpen }) => {
  const pathname = usePathname();
  const { resolvedOS } = useDeviceTheme();

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: 'fa-solid fa-chart-pie',
      isExact: true,
    },
    {
      href: '/team-inbox',
      label: 'المحادثات',
      icon: 'fa-solid fa-comments',
      badge: '3',
      badgeColor: 'green',
    },
    {
      href: '/orders',
      label: 'الطلبات',
      icon: 'fa-solid fa-bag-shopping',
      badge: 'جديد',
      badgeColor: 'amber',
    },
    {
      href: '/send-message',
      label: 'الحملات',
      icon: 'fa-solid fa-bullhorn',
    },
  ];

  const isIOS = resolvedOS === 'ios';

  return (
    <nav
      id="bottom-navigation"
      aria-label="التنقل السفلي للموبايل"
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-all duration-300 select-none ${
        isIOS
          ? 'backdrop-blur-2xl bg-[#121215]/85 border-t border-white/[0.08] shadow-[0_-4px_25px_rgba(0,0,0,0.6)]'
          : 'bg-[#1a1b20] border-t border-[#2d2e35] shadow-[0_-8px_24px_rgba(0,0,0,0.65)]'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className={`flex items-center justify-around px-2 ${isIOS ? 'h-15 pt-1.5' : 'h-16'}`}>
        {navItems.map((item) => {
          const isActive = item.isExact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-1 flex-col items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green ${
                isIOS ? 'py-1' : 'py-1.5'
              } ${
                isActive
                  ? isIOS
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-400 font-bold'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* iOS Active Glow Dot / Android M3 Active Pill */}
              {isIOS ? (
                // Apple iOS Style: Clean icon glyph with subtle top indicator bar or emerald tint
                <>
                  <div className="relative flex h-7 w-7 items-center justify-center">
                    <i
                      className={`${item.icon} text-lg transition-transform group-active:scale-95 ${
                        isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''
                      }`}
                    ></i>
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                          item.badgeColor === 'amber'
                            ? 'bg-amber-500 text-black'
                            : 'bg-emerald-500 text-black'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] tracking-tight mt-0.5 leading-tight ${
                      isActive ? 'font-bold text-emerald-400' : 'font-medium text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <span
                      className="absolute bottom-0 h-0.5 w-4 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"
                      aria-hidden="true"
                    />
                  )}
                </>
              ) : (
                // Android Material 3 Style: Pill container behind the icon
                <>
                  <div
                    className={`relative flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                        : 'h-8 px-3 text-zinc-400'
                    }`}
                  >
                    <i className={`${item.icon} text-base transition-transform group-active:scale-90`}></i>
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-mono font-bold ${
                          item.badgeColor === 'amber'
                            ? 'bg-amber-500 text-black'
                            : 'bg-emerald-500 text-black'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`mt-1 text-[11px] leading-tight transition-colors ${
                      isActive ? 'font-extrabold text-emerald-400' : 'font-medium text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}

        {/* More button (Settings & Full Sidebar drawer) */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className={`group relative flex flex-1 flex-col items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green ${
            isIOS ? 'py-1' : 'py-1.5'
          } ${
            isDrawerOpen
              ? 'text-emerald-400 font-bold'
              : 'text-dark-text-secondary hover:text-dark-text-primary'
          }`}
          aria-label="المزيد من القوائم والإعدادات"
          aria-expanded={isDrawerOpen}
        >
          {isIOS ? (
            <>
              <div className="relative flex h-7 w-7 items-center justify-center">
                <i
                  className={`fa-solid fa-bars-staggered text-lg transition-transform group-active:scale-95 ${
                    isDrawerOpen ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''
                  }`}
                ></i>
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-tight ${
                  isDrawerOpen ? 'font-bold text-emerald-400' : 'font-medium text-zinc-400'
                }`}
              >
                المزيد
              </span>
              {isDrawerOpen && (
                <span
                  className="absolute bottom-0 h-0.5 w-4 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            <>
              <div
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isDrawerOpen
                    ? 'bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'h-8 px-3 text-zinc-400'
                }`}
              >
                <i className="fa-solid fa-bars-staggered text-base transition-transform group-active:scale-90"></i>
              </div>
              <span
                className={`mt-1 text-[11px] leading-tight transition-colors ${
                  isDrawerOpen ? 'font-extrabold text-emerald-400' : 'font-medium text-zinc-400'
                }`}
              >
                المزيد
              </span>
            </>
          )}
        </button>
      </div>

      {/* Apple iOS Home Indicator bar */}
      {isIOS && (
        <div className="hidden xs:block sm:block pb-1" aria-hidden="true">
          <div className="w-32 h-1 bg-white/20 rounded-full mx-auto" />
        </div>
      )}
    </nav>
  );
};

export default BottomNavigation;
