
import { Webhook } from '../types';

export const initialWebhooks: Webhook[] = [
  { id: 'wh_1', name: 'CRM Contact Sync', url: 'https://api.mycrm.com/v1/webhooks/whatsapp', events: ['contact.created', 'message.received'], status: 'active' },
  { id: 'wh_2', name: 'Analytics Tracker', url: 'https://api.analytics.com/ingress', events: ['message.sent'], status: 'active' },
  { id: 'wh_3', name: 'Zapier Inbound Messages', url: 'https://hooks.zapier.com/hooks/catch/12345/abcde/', events: ['message.received'], status: 'inactive' },
];
