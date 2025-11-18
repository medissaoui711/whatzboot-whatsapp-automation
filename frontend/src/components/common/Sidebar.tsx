'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNavLinks, toolsNavLinks } from '@/data/nav.data';
import { NavLink } from '@/types';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebarRef.current || sidebarRef.current.contains(target as Node)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [setIsOpen]);

  const renderLink = (link: NavLink) => (
    <li key={link.href}>
      <Link
        href={link.href}
        className={`flex items-center rounded-md p-2 text-dark-text-secondary transition-colors hover:bg-dark-border hover:text-dark-text-primary ${
          pathname === link.href ? 'bg-dark-border text-dark-text-primary' : ''
        }`}
      >
        <i className={`${link.icon} mr-3 w-5 text-center`}></i>
        <span>{link.label}</span>
      </Link>
    </li>
  );

  return (
    <aside
      ref={sidebarRef}
      className={`absolute left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-dark-border bg-dark-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b border-dark-border">
        <Link href="/">
          <Image
            src="/brand/logo-dark-bg.svg"
            alt="WhatzBoot"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <h3 className="mb-2 text-xs font-semibold uppercase text-dark-text-secondary">
          Menu
        </h3>
        <ul className="space-y-2">{mainNavLinks.map(renderLink)}</ul>

        <h3 className="mb-2 mt-6 text-xs font-semibold uppercase text-dark-text-secondary">
          Tools
        </h3>
        <ul className="space-y-2">{toolsNavLinks.map(renderLink)}</ul>
      </nav>

        <div className="border-t border-dark-border p-4">
            <p className="text-center text-xs text-dark-text-secondary">WhatzBoot v2.0</p>
        </div>
    </aside>
  );
};

export default Sidebar;
