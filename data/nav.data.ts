import React from 'react';
import { Role } from '../types';

export interface NavItem {
    nameKey: string;
    path: string;
    icon: React.ReactNode;
    roles: Role[];
}

export const ALL_NAV_ITEMS: NavItem[] = [
    // FIX: Replaced JSX syntax with React.createElement to resolve parsing errors in a .ts file.
    { nameKey: 'nav.dashboard', path: '/dashboard', icon: React.createElement('i', { className: 'fa-solid fa-tachometer-alt' }), roles: ['Admin', 'Marketer', 'Agent'] },
    { nameKey: 'nav.team_inbox', path: '/team-inbox', icon: React.createElement('i', { className: 'fa-solid fa-inbox' }), roles: ['Admin', 'Agent'] },
    { nameKey: 'nav.automations', path: '/automations', icon: React.createElement('i', { className: 'fa-solid fa-gears' }), roles: ['Admin', 'Marketer'] },
    { nameKey: 'nav.auto_responder', path: '/auto-responder', icon: React.createElement('i', { className: 'fa-solid fa-robot' }), roles: ['Admin', 'Marketer', 'Agent'] },
    { nameKey: 'nav.broadcaster', path: '/broadcaster', icon: React.createElement('i', { className: 'fa-solid fa-bullhorn' }), roles: ['Admin', 'Marketer'] },
    { nameKey: 'nav.template_manager', path: '/templates', icon: React.createElement('i', { className: 'fa-solid fa-layer-group' }), roles: ['Admin', 'Marketer'] },
    { nameKey: 'nav.contact_manager', path: '/contact-manager', icon: React.createElement('i', { className: 'fa-solid fa-address-book' }), roles: ['Admin', 'Marketer'] },
    { nameKey: 'nav.group_manager', path: '/group-manager', icon: React.createElement('i', { className: 'fa-solid fa-users' }), roles: ['Admin', 'Marketer', 'Agent'] },
    { nameKey: 'nav.analytics', path: '/analytics', icon: React.createElement('i', { className: 'fa-solid fa-chart-line' }), roles: ['Admin', 'Marketer'] },
    { nameKey: 'nav.number_filter', path: '/number-filter', icon: React.createElement('i', { className: 'fa-solid fa-filter' }), roles: ['Admin'] },
    { nameKey: 'nav.settings', path: '/settings', icon: React.createElement('i', { className: 'fa-solid fa-cog' }), roles: ['Admin'] },
];
