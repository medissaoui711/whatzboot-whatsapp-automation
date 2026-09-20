'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavLinks, toolsNavLinks } from '@/data/nav.data';
import { NavLink } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  // Toggle direction icon:
  // In RTL:
  //   Expanded -> 'fa-chevron-right' (points towards the right edge to fold)
  //   Collapsed -> 'fa-chevron-left' (points towards the left content to unfold)
  // In LTR:
  //   Expanded -> 'fa-chevron-left' (points towards the left edge to fold)
  //   Collapsed -> 'fa-chevron-right' (points towards the right content to unfold)
  const toggleIcon = isRTL
    ? isCollapsed
      ? 'fa-solid fa-chevron-left'
      : 'fa-solid fa-chevron-right'
    : isCollapsed
      ? 'fa-solid fa-chevron-right'
      : 'fa-solid fa-chevron-left';

  const renderLink = (link: NavLink) => {
    const isActive = pathname === link.href;

    return (
      <li key={link.href} className="relative group flex justify-center">
        <Link
          href={link.href}
          className={`relative flex items-center rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green ${
            isCollapsed
              ? 'justify-center w-11 h-11'
              : 'w-full gap-3.5 px-3.5 py-2.5'
          } ${
            isActive
              ? isCollapsed
                ? 'bg-whatsapp-green text-black font-bold shadow-[0_0_18px_#10b981,0_0_30px_rgba(16,185,129,0.45)] ring-2 ring-emerald-300'
                : 'bg-whatsapp-green/15 text-whatsapp-green font-bold shadow-sm shadow-whatsapp-green/10 border border-whatsapp-green/20'
              : isCollapsed
                ? 'text-dark-text-secondary hover:text-whatsapp-green hover:bg-whatsapp-green/10 hover:shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                : 'text-dark-text-secondary hover:bg-dark-border/60 hover:text-dark-text-primary'
          }`}
          aria-current={isActive ? 'page' : undefined}
          aria-label={link.label}
        >
          {/* Luminous Active Lateral Indicator Bar when Collapsed */}
          {isCollapsed && isActive && (
            <span
              className="absolute -start-1.5 inset-y-2 w-1.5 rounded-full bg-whatsapp-green shadow-[0_0_12px_#10b981]"
              aria-hidden="true"
            />
          )}

          {/* Icon Box */}
          <div
            className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 ${
              isCollapsed
                ? 'h-6 w-6'
                : `h-8 w-8 rounded-lg ${
                    isActive
                      ? 'bg-whatsapp-green text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-dark-border/40 text-dark-text-secondary group-hover:bg-dark-border group-hover:text-whatsapp-green'
                  }`
            }`}
          >
            <i
              className={`${link.icon} ${
                isCollapsed
                  ? `text-base ${
                      isActive
                        ? 'text-black drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] scale-110'
                        : 'group-hover:scale-110 transition-transform'
                    }`
                  : 'text-sm'
              }`}
            ></i>

            {/* Luminous Notification Dot for Collapsed Mode (Zero text) */}
            {isCollapsed && link.badge && (
              <span
                className={`absolute -top-1.5 -end-1.5 flex h-2.5 w-2.5 rounded-full ring-2 ring-dark-card animate-pulse ${
                  link.badgeColor === 'amber'
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-whatsapp-green shadow-[0_0_8px_#10b981]'
                }`}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Label and Badge ONLY displayed when Expanded, COMPLETELY hidden when collapsed */}
          {!isCollapsed && (
            <div className="flex flex-1 items-center justify-between overflow-hidden transition-opacity duration-200">
              <span className="truncate text-xs font-medium">{link.label}</span>
              {link.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    link.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {link.badge}
                </span>
              )}
              {isActive && !link.badge && (
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp-green shrink-0 shadow-[0_0_6px_#10b981]"></span>
              )}
            </div>
          )}
        </Link>

        {/* Floating Tooltip in Collapsed Mode (Zero text in sidebar, tooltip only on hover) */}
        {isCollapsed && (
          <div
            role="tooltip"
            className="pointer-events-none absolute start-full top-1/2 -translate-y-1/2 ms-3.5 z-50 hidden group-hover:flex items-center gap-2 rounded-xl bg-[#1a1b24] px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_12px_rgba(16,185,129,0.25)] border border-whatsapp-green/40 whitespace-nowrap transition-all duration-150 animate-fade-in-up"
          >
            <span className="text-dark-text-primary">{link.label}</span>
            {link.badge && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  link.badgeColor === 'amber'
                    ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'bg-whatsapp-green text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                }`}
              >
                {link.badge}
              </span>
            )}
            {/* Tooltip triangle arrow */}
            <span
              className="absolute -start-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-e-whatsapp-green/40"
              aria-hidden="true"
            />
          </div>
        )}
      </li>
    );
  };

  return (
    <aside
      id="desktop-sidebar"
      aria-label="القائمة الجانبية لسطح المكتب"
      className={`hidden md:flex shrink-0 flex-col border-e border-dark-border bg-dark-card/95 backdrop-blur-md transition-[width] duration-300 ease-in-out relative select-none z-30 ${
        isCollapsed ? 'w-[70px]' : 'w-64'
      }`}
    >
      {/* Floating Soft Circular Collapse/Expand Toggle Button at Lateral Divider Edge */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className={`absolute top-8 -translate-y-1/2 z-50 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#333647] bg-[#1a1c26] text-zinc-300 shadow-[0_4px_14px_rgba(0,0,0,0.7),0_0_10px_rgba(16,185,129,0.2)] transition-all duration-300 ease-out hover:border-whatsapp-green hover:bg-whatsapp-green hover:text-black hover:shadow-[0_0_18px_rgba(16,185,129,0.6)] hover:scale-115 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green cursor-pointer ${
          isRTL ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
        }`}
        aria-label={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
        aria-expanded={!isCollapsed}
        aria-controls="desktop-sidebar"
        title={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
      >
        <i className={`${toggleIcon} text-[11px] transition-transform duration-200`}></i>
      </button>

      {/* Brand & Header Section */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-dark-border px-3.5 transition-all duration-300 ${
          isCollapsed ? 'justify-center' : 'justify-start'
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-3 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green rounded-xl ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
          title="WhatzBoot PRO"
        >
          {/* Luminous Logo Icon */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-whatsapp-green text-black font-bold shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-transform duration-200 ${
              isCollapsed ? 'ring-2 ring-emerald-300/30' : ''
            }`}
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
          </div>

          {/* Brand text ONLY when expanded - COMPLETELY HIDDEN when collapsed */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  Whatz<span className="text-whatsapp-green">Boot</span>
                </span>
                <span className="rounded bg-whatsapp-green/20 px-1 py-0.2 text-[9px] font-bold text-whatsapp-green font-mono">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-dark-text-secondary truncate">استوديو مبيعات واتساب</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List - Only Icons when Collapsed */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <div>
          {!isCollapsed ? (
            <h3 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary/70">
              القائمة الرئيسية
            </h3>
          ) : (
            <div className="h-px bg-dark-border/40 mx-2 my-2" aria-hidden="true" />
          )}
          <ul className="space-y-1.5">{mainNavLinks.map(renderLink)}</ul>
        </div>

        <div>
          {!isCollapsed ? (
            <h3 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary/70">
              الأدوات المساندة
            </h3>
          ) : (
            <div className="h-px bg-dark-border/40 mx-2 my-2" aria-hidden="true" />
          )}
          <ul className="space-y-1.5">{toolsNavLinks.map(renderLink)}</ul>
        </div>
      </nav>

      {/* Footer Status */}
      <div className="border-t border-dark-border p-3 shrink-0">
        {isCollapsed ? (
          <div className="group relative flex items-center justify-center">
            {/* Luminous Pulsing WhatsApp Connection Indicator (Icon only) */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-whatsapp-green shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer hover:shadow-[0_0_22px_rgba(16,185,129,0.6)] transition-all"
              title="واتساب متصل"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp-green opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-whatsapp-green shadow-[0_0_8px_#10b981]"></span>
              </span>
            </div>
            {/* Tooltip on hover */}
            <div
              role="tooltip"
              className="pointer-events-none absolute start-full top-1/2 -translate-y-1/2 ms-3.5 hidden group-hover:flex items-center rounded-xl bg-[#1a1b24] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_12px_rgba(16,185,129,0.25)] border border-whatsapp-green/40 whitespace-nowrap z-50 animate-fade-in-up"
            >
              جلسة واتساب متصلة (v2.4 PRO)
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-dark-bg/60 p-2.5 border border-dark-border text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp-green opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-whatsapp-green shadow-[0_0_6px_#10b981]"></span>
              </span>
              <span className="text-[11px] text-dark-text-secondary font-medium">واتساب متصل</span>
            </div>
            <span className="rounded bg-dark-border/50 px-1.5 py-0.5 text-[10px] font-mono text-dark-text-secondary">
              v2.4 PRO
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
