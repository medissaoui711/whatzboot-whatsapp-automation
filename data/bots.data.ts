
import { AutoResponderBot } from '../types';

export const initialBots: AutoResponderBot[] = [
  { id: '1', name: 'Welcome Bot', trigger: 'hello, hi', response: 'Welcome to our service! How can I help you?', status: 'active', lastTriggered: '2 hours ago' },
  { id: '2', name: 'Support Hours Bot', trigger: 'hours, support time', response: 'Our support hours are 9 AM to 5 PM, Mon-Fri.', status: 'active', lastTriggered: '1 day ago' },
  { id: '3', name: 'Pricing Bot', trigger: 'price, pricing', response: 'You can find our pricing details at ourwebsite.com/pricing.', status: 'inactive', lastTriggered: '1 week ago' },
];
