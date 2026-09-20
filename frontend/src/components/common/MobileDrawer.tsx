'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mainNavLinks, toolsNavLinks } from '@/data/nav.data';
import { NavLink } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useDeviceTheme } from '@/contexts/DeviceThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sub-pages inside the Settings Gear (ترس الإعدادات)
const settingsGearPages = [
  {
    href: '/settings?tab=device',
    tabId: 'device',
    label: 'حالة الاتصال وجلسة واتساب',
    icon: 'fa-solid fa-mobile-screen',
    subtext: 'إدارة الربط النشط ورقم الهاتف',
  },
  {
    href: '/settings?tab=profile',
    tabId: 'profile',
    label: 'الملف التجاري وكتالوج المتجر',
    icon: 'fa-solid fa-store',
    subtext: 'اسم المتجر، الوصف وساعات العمل',
  },
  {
    href: '/settings?tab=payments',
    tabId: 'payments',
    label: 'بوابات الدفع الإلكتروني (Webhooks)',
    icon: 'fa-solid fa-credit-card',
    subtext: 'ميسر، تمارا، وبوابات الدفع الفورية',
  },
  {
    href: '/settings?tab=language',
    tabId: 'language',
    label: 'اللغة ومظهر النظام',
    icon: 'fa-solid fa-palette',
    subtext: 'العربية / الإنجليزية وتخصيص العرض',
  },
];

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const { themeMode, resolvedOS, setThemeMode } = useDeviceTheme();
  const { direction } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Active settings collapse section in the drawer
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);

  // Touch swipe support to close drawer natively
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;

    // In RTL, drawer is on the right. Swiping towards right (positive diffX > 50) closes it.
    // In LTR, drawer is on the left. Swiping towards left (negative diffX < -50) closes it.
    if (direction === 'rtl' && diffX > 60) {
      onClose();
    } else if (direction === 'ltr' && diffX < -60) {
      onClose();
    }
    touchStartXRef.current = null;
  };

  // Close on Escape key & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  const isIOS = resolvedOS === 'ios';

  const renderSidebarLink = (link: NavLink) => {
    const isActive = pathname === link.href;

    if (isIOS) {
      // Apple iOS Cupertino Inset List Item Style
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onClose}
            className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm'
                : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-white/[0.08] text-zinc-400 group-hover:text-emerald-400'
                }`}
              >
                <i className={`${link.icon} text-sm`}></i>
              </div>
              <span className="text-xs font-medium truncate">{link.label}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {link.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    link.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {link.badge}
                </span>
              )}
              <i className="fa-solid fa-chevron-left rtl:rotate-0 ltr:rotate-180 text-[10px] text-zinc-500 group-hover:text-zinc-300"></i>
            </div>
          </Link>
        </li>
      );
    }

    // Android Material 3 Drawer Item Style
    return (
      <li key={link.href}>
        <Link
          href={link.href}
          onClick={onClose}
          className={`group flex items-center gap-3.5 rounded-full px-4 py-2.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-300 font-extrabold shadow-sm'
              : 'text-dark-text-secondary hover:bg-dark-border/40 hover:text-white'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isActive
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'bg-dark-border/50 text-dark-text-secondary group-hover:bg-dark-border group-hover:text-emerald-400'
            }`}
          >
            <i className={`${link.icon} text-sm`}></i>
          </div>
          <span className="flex-1 truncate">{link.label}</span>
          {link.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                link.badgeColor === 'amber'
                  ? 'bg-amber-500 text-black'
                  : 'bg-emerald-500 text-black'
              }`}
            >
              {link.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Backdrop (Covers entire screen, header, and bottom navigation) */}
      <div
        className={`fixed inset-0 z-[65] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${isIOS ? 'bg-black/70 backdrop-blur-md' : 'bg-black/80'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Sheet: Anchored flush to the edge (Right edge in RTL, Left edge in LTR) */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الجانبية للتطبيق"
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed top-0 bottom-0 h-dvh max-h-screen z-[70] flex w-[85%] sm:w-[350px] max-w-[380px] flex-col transition-transform duration-300 ease-out select-none lg:hidden ${
          // Directional edge docking:
          direction === 'rtl'
            ? 'right-0 left-auto rounded-l-2xl border-l'
            : 'left-0 right-auto rounded-r-2xl border-r'
        } ${
          // Slide transform:
          isOpen
            ? 'translate-x-0'
            : direction === 'rtl'
              ? 'translate-x-full'
              : '-translate-x-full'
        } ${
          isIOS
            ? 'backdrop-blur-3xl bg-[#161619]/96 border-white/[0.1] shadow-[-14px_0_40px_rgba(0,0,0,0.85)]'
            : 'bg-[#1a1b22] border-[#2d2e36] shadow-[-14px_0_40px_rgba(0,0,0,0.95)]'
        }`}
        style={{
          paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        }}
      >
        {/* Top Header */}
        <div
          className={`flex h-16 shrink-0 items-center justify-between border-b px-4 ${
            isIOS ? 'border-white/[0.08] bg-[#121215]/60' : 'border-[#2d2e36] bg-[#14151b]'
          }`}
        >
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-whatsapp-green text-black font-bold shadow-md shadow-whatsapp-green/25">
              <i className="fa-brands fa-whatsapp text-xl"></i>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  Whatz<span className="text-whatsapp-green">Boot</span>
                </span>
                <span className="rounded bg-whatsapp-green/20 px-1 py-0.2 text-[9px] font-bold text-whatsapp-green font-mono">
                  {isIOS ? 'iOS' : 'Android'}
                </span>
              </div>
              <span className="text-[10px] text-dark-text-secondary">استوديو التجارة والمبيعات</span>
            </div>
          </Link>

          {/* Close button with high-contrast touch target */}
          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center transition-colors ${
              isIOS
                ? 'rounded-full bg-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.15]'
                : 'rounded-xl border border-dark-border bg-dark-bg/80 text-dark-text-secondary hover:text-white hover:border-whatsapp-green/40'
            }`}
            aria-label="إغلاق القائمة"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* WhatsApp Connection Pill Banner */}
        <div
          className={`border-b px-4 py-2.5 shrink-0 ${
            isIOS ? 'border-white/[0.06] bg-white/[0.02]' : 'border-[#2d2e36] bg-[#14151a]'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp-green opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-whatsapp-green shadow-[0_0_6px_#10b981]"></span>
              </span>
              <span className="text-zinc-200 font-semibold text-[11px]">جلسة واتساب نشطة</span>
            </div>
            <span
              className="font-mono text-emerald-400 text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md"
              dir="ltr"
            >
              +966 50 829 4410
            </span>
          </div>
        </div>

        {/* Main Scrollable Navigation Content */}
        <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5">
          {/* 1. القائمة الرئيسية (Main Navigation Links from Desktop Sidebar) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <i className="fa-solid fa-layer-group text-[10px]"></i>
                القائمة الرئيسية والعمليات
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {mainNavLinks.length} صفحات
              </span>
            </div>
            <ul className="space-y-1">{mainNavLinks.map(renderSidebarLink)}</ul>
          </div>

          {/* 2. قائمة الصفحات في ترس الإعدادات (Settings Gear Sub-pages) */}
          <div
            className={`rounded-2xl border p-3 transition-all ${
              isIOS
                ? 'bg-white/[0.03] border-white/[0.08]'
                : 'bg-[#15161c] border-[#2d2e36]'
            }`}
          >
            {/* Header of Settings Gear */}
            <div className="flex items-center justify-between mb-1.5 px-1">
              <Link
                href="/settings"
                onClick={onClose}
                className="flex items-center gap-2 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <i className="fa-solid fa-gear text-xs"></i>
                </div>
                <span>ترس الإعدادات (Settings)</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsSettingsExpanded((prev) => !prev)}
                className="text-[11px] text-zinc-400 hover:text-white p-1"
                aria-label="تبديل عرض إعدادات الترس"
              >
                <i
                  className={`fa-solid fa-chevron-down transition-transform duration-200 ${
                    isSettingsExpanded ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>
            </div>

            {/* Sub-pages list of Settings */}
            {isSettingsExpanded && (
              <ul className="mt-2 space-y-1 border-t border-white/[0.06] pt-2">
                {settingsGearPages.map((setting) => {
                  const isCurrentTab =
                    pathname === '/settings' &&
                    typeof window !== 'undefined' &&
                    window.location.search.includes(`tab=${setting.tabId}`);

                  return (
                    <li key={setting.href}>
                      <Link
                        href={setting.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                          isCurrentTab
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              isCurrentTab
                                ? 'bg-amber-500 text-black'
                                : 'bg-white/[0.08] text-zinc-400'
                            }`}
                          >
                            <i className={`${setting.icon} text-xs`}></i>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate">
                              {setting.label}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate">
                              {setting.subtext}
                            </span>
                          </div>
                        </div>

                        <i className="fa-solid fa-chevron-left rtl:rotate-0 ltr:rotate-180 text-[10px] text-zinc-500"></i>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 3. الأدوات المساندة (Tools) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-dark-text-secondary/70 flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                الأدوات المساندة
              </h3>
            </div>
            <ul className="space-y-1">{toolsNavLinks.map(renderSidebarLink)}</ul>
          </div>

          {/* 4. OS Simulation & Styling Mode Switcher */}
          <div
            className={`rounded-2xl border p-3 ${
              isIOS ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-[#15161c] border-[#2d2e36]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                <i className="fa-solid fa-mobile-screen-button text-emerald-400"></i>
                نمط واجهة الهاتف المعتمد
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                {resolvedOS === 'ios' ? 'Apple iOS' : 'Android'}
              </span>
            </div>

            {/* Mode Switch Pills */}
            <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-xl border border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => setThemeMode('android')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'android'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <i className="fa-brands fa-android text-xs"></i>
                <span>أندرويد</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('ios')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'ios'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <i className="fa-brands fa-apple text-xs"></i>
                <span>آبل iOS</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('auto')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'auto'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-bolt text-xs"></i>
                <span>تلقائي</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Account & Logout */}
        <div
          className={`shrink-0 border-t p-3 space-y-2.5 ${
            isIOS ? 'border-white/[0.08] bg-[#121215]/80' : 'border-[#2d2e36] bg-[#14151a]'
          }`}
        >
          {user && (
            <div
              className={`flex items-center justify-between rounded-xl border p-2.5 ${
                isIOS
                  ? 'bg-white/[0.05] border-white/[0.08]'
                  : 'bg-[#181920] border-[#2d2e36]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-dark-border">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || 'User'}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-whatsapp-green">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">مدير المتجر</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <i className="fa-solid fa-right-from-bracket text-xs"></i>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500">
            <span>WhatzBoot Commerce Studio</span>
            <span className="font-mono">v2.4 PRO</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
