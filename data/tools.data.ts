import React from 'react';

export interface Tool {
  id: string;
  path: string;
  icon: React.ReactNode;
}

export const ALL_TOOLS: Tool[] = [
  // Core Features
  { id: 'auto_responder', path: '/auto-responder', icon: React.createElement('i', { className: 'fa-solid fa-robot' }) },
  { id: 'broadcaster', path: '/broadcaster', icon: React.createElement('i', { className: 'fa-solid fa-bullhorn' }) },
  { id: 'group_manager', path: '/group-manager', icon: React.createElement('i', { className: 'fa-solid fa-users-gear' }) },
  { id: 'number_filter', path: '/number-filter', icon: React.createElement('i', { className: 'fa-solid fa-filter-circle-check' }) },
  
  // Standalone Tools
  { id: 'google_maps_extractor', path: '/tools/google-maps-extractor', icon: React.createElement('i', { className: 'fa-solid fa-map-location-dot' }) },
  { id: 'auto_group_joiner', path: '/tools/auto-group-joiner', icon: React.createElement('i', { className: 'fa-solid fa-person-walking-arrow-right' }) },
  { id: 'group_finder', path: '/tools/group-finder', icon: React.createElement('i', { className: 'fa-solid fa-magnifying-glass' }) },
  { id: 'group_generator', path: '/tools/group-generator', icon: React.createElement('i', { className: 'fa-solid fa-users-rays' }) },
  { id: 'social_media_extractor', path: '/tools/social-media-extractor', icon: React.createElement('i', { className: 'fa-solid fa-share-nodes' }) },
  { id: 'group_link_scraper', path: '/tools/group-link-scraper', icon: React.createElement('i', { className: 'fa-solid fa-link' }) },
  { id: 'active_member_extractor', path: '/tools/active-member-extractor', icon: React.createElement('i', { className: 'fa-solid fa-user-clock' }) },
  { id: 'chat_list_extractor', path: '/tools/chat-list-extractor', icon: React.createElement('i', { className: 'fa-solid fa-address-book' }) },
  { id: 'google_contacts_tool', path: '/tools/google-contacts-tool', icon: React.createElement('i', { className: 'fa-solid fa-file-csv' }) },
  { id: 'email_extractor', path: '/tools/email-extractor', icon: React.createElement('i', { className: 'fa-solid fa-envelope-open-text' }) },
  { id: 'account_warmup', path: '/tools/account-warmup', icon: React.createElement('i', { className: 'fa-solid fa-fire' }) },
];