'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import { useUser } from '@/contexts/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

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
    <div className="flex h-screen bg-dark-bg text-dark-text-primary">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-dark-bg p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
