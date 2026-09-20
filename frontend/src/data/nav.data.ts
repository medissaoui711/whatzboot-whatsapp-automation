import { NavLink } from '@/types';

export const mainNavLinks: NavLink[] = [
  { href: '/', label: 'لوحة التحكم والمبيعات', icon: 'fas fa-chart-pie' },
  { href: '/voice-agent', label: 'الوكيل الصوتي الذكي (Voice AI)', icon: 'fas fa-headset', badge: 'صوتي 🎙️', badgeColor: 'amber' },
  { href: '/groups', label: 'إدارة مجموعات واتساب', icon: 'fas fa-users-rectangle', badge: 'جديد', badgeColor: 'green' },
  { href: '/team-inbox', label: 'المحادثات والمبيعات المباشرة', icon: 'fas fa-comments', badge: '3', badgeColor: 'green' },
  { href: '/orders', label: 'الطلبات وسلات الشراء', icon: 'fas fa-shopping-bag', badge: 'جديد', badgeColor: 'amber' },
  { href: '/send-message', label: 'حملات الترويج (Broadcaster)', icon: 'fas fa-bullhorn' },
  { href: '/automations', label: 'الكتالوج والرد الذكي', icon: 'fas fa-robot' },
  { href: '/contact-manager', label: 'سجل العملاء وعملاء VIP', icon: 'fas fa-users' },
  { href: '/analytics', label: 'تقارير الإيرادات والنمو', icon: 'fas fa-chart-line' },
  { href: '/settings', label: 'ربط واتساب وإعدادات المتجر', icon: 'fas fa-cog' },
];

export const toolsNavLinks: NavLink[] = [
  { href: '/tools', label: 'روابط وباركود واتساب السريع', icon: 'fas fa-qrcode' },
];
