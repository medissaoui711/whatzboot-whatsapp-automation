
import { MessageTemplate } from '../types';

export const initialTemplates: MessageTemplate[] = [
    { id: '1', name: 'Monthly Promotion', message: 'Hello {name}! Check out our monthly promotion for a 20% discount!', approvalStatus: 'Approved' },
    { id: '2', name: 'Holiday Greeting', message: 'Happy holidays from the WhatzBoot team!', approvalStatus: 'Approved' },
    { id: '3', name: 'Order Confirmation', message: 'Hi {name}, your order #12345 has been confirmed.', approvalStatus: 'Pending' },
    { id: '4', name: 'Rejected Template', message: 'This template contains forbidden words.', approvalStatus: 'Rejected' },
];

export const broadcasterTemplates: MessageTemplate[] = [
    { id: '1', name: 'Monthly Promotion', message: 'Hello! Check out our monthly promotion for a 20% discount!', approvalStatus: 'Approved' },
    { id: '2', name: 'Holiday Greeting', message: 'Happy holidays from the WhatzBoot team!', approvalStatus: 'Approved' },
];
