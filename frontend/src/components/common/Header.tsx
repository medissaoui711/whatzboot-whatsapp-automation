'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-card px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Hamburger menu */}
        <button
          className="text-dark-text-secondary hover:text-dark-text-primary lg:hidden"
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="5" width="16" height="2" />
            <rect x="4" y="11" width="16" height="2" />
            <rect x="4" y="17" width="16" height="2" />
          </svg>
        </button>

        {/* Header content - Spacer */}
        <div className="flex-1"></div>

        {/* User menu */}
        {user && (
          <div className="relative ml-3">
            <div className="flex items-center space-x-4">
              <span className="hidden font-medium text-dark-text-primary sm:block">
                {user.name}
              </span>
              <div className="h-9 w-9 rounded-full bg-dark-border">
                  {user.avatar && <Image src={user.avatar} alt="User Avatar" width={36} height={36} className="rounded-full" />}
              </div>
               <button
                  onClick={handleLogout}
                  className="ml-2 text-dark-text-secondary hover:text-whatsapp-green"
                  title="Logout"
               >
                  <i className="fa-solid fa-right-from-bracket"></i>
               </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;