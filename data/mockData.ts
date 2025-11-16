import { AutoResponderBot, Contact, CampaignPerformance } from "../types";

export const initialBots: AutoResponderBot[] = [
  { id: '1', name: 'Welcome Bot', trigger: 'hello, hi', response: 'Welcome to our service! How can I help you?', status: 'active', lastTriggered: '2 hours ago' },
  { id: '2', name: 'Support Hours Bot', trigger: 'hours, support time', response: 'Our support hours are 9 AM to 5 PM, Mon-Fri.', status: 'active', lastTriggered: '1 day ago' },
  { id: '3', name: 'Pricing Bot', trigger: 'price, pricing', response: 'You can find our pricing details at ourwebsite.com/pricing.', status: 'inactive', lastTriggered: '1 week ago' },
];

export const initialContacts: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1234567890', tags: ['Lead', 'VIP'] },
  { id: '2', name: 'Jane Smith', phone: '+1987654321', tags: ['Customer'] },
  { id: '3', name: 'Peter Jones', phone: '+1122334455', tags: ['Follow-up', 'Lead'] },
];

export const initialPerformance: CampaignPerformance[] = [
    { id: '1', name: 'Q4 Holiday Sale', sentDate: '2023-12-15', recipients: 1250, deliveryRate: 99.1, readRate: 82.5, replyRate: 20.3 },
    { id: '2', name: 'Black Friday Preview', sentDate: '2023-11-20', recipients: 1100, deliveryRate: 98.7, readRate: 78.1, replyRate: 18.5 },
    { id: '3', name: 'New Product Launch', sentDate: '2023-11-05', recipients: 950, deliveryRate: 97.5, readRate: 65.4, replyRate: 12.1 },
    { id: '4', name: 'October Newsletter', sentDate: '2023-10-28', recipients: 890, deliveryRate: 99.5, readRate: 71.9, replyRate: 10.5 },
    { id: '5', name: 'Customer Feedback Request', sentDate: '2023-10-10', recipients: 850, deliveryRate: 96.0, readRate: 70.1, replyRate: 22.4 },
];
