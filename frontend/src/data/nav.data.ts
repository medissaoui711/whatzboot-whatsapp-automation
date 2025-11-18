import { NavLink } from '@/types';

export const mainNavLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { href: '/team-inbox', label: 'Team Inbox', icon: 'fas fa-inbox' },
  { href: '/send-message', label: 'Send Message', icon: 'fas fa-paper-plane' },
  { href: '/orders', label: 'Orders', icon: 'fas fa-receipt' },
  { href: '/automations', label: 'Automations', icon: 'fas fa-cogs' },
  { href: '/contact-manager', label: 'Contact Manager', icon: 'fas fa-address-book' },
  { href: '/analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
  { href: '/settings', label: 'Settings', icon: 'fas fa-cog' },
];

export const toolsNavLinks: NavLink[] = [
    { href: '/tools', label: 'All Tools', icon: 'fas fa-tools' },
];
