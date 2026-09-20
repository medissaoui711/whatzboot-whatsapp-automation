'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import MobileDrawer from '@/components/common/MobileDrawer';
import { useUser } from '@/contexts/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  // Load sidebar collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('whatzboot-sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      } else if (window.innerWidth >= 768 && window.innerWidth < 1180) {
        // Default collapsed for compact laptop, tablet landscape, and preview screens
        setIsCollapsed(true);
      }
    } catch {
      // Ignore localStorage read errors if sandboxed
    }
  }, []);

  // Save sidebar preference
  const handleSetIsCollapsed = (val: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsed((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('whatzboot-sidebar-collapsed', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  useEffect(() => {
    // Redirect to login if user is not authenticated and loading is finished.
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Render a loading state while checking for user auth.
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg text-white">
        <i className="fas fa-spinner fa-spin text-3xl text-whatsapp-green"></i>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-dark-text-primary">
      {/* Desktop & Tablet Persistent Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSetIsCollapsed}
      />

      {/* Mobile Touch-Friendly Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Responsive Header */}
        <Header
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          isDesktopCollapsed={isCollapsed}
          onToggleDesktopCollapse={() => handleSetIsCollapsed((prev) => !prev)}
        />

        {/* Scrollable Main Area (with safe-area bottom padding for mobile bar) */}
        <main
          id="main-content"
          className={`flex-1 overflow-y-auto overflow-x-hidden bg-dark-bg p-3.5 sm:p-5 md:p-6 pb-24 md:pb-8 focus:outline-none transition-all duration-300 ease-in-out ${
            isCollapsed ? 'md:px-8 xl:px-10 md:py-6' : 'md:px-5 xl:px-7 md:py-6'
          }`}
          tabIndex={-1}
        >
          <div className="w-full max-w-[1720px] mx-auto transition-all duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <BottomNavigation
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        isDrawerOpen={isMobileDrawerOpen}
      />
    </div>
  );
}
