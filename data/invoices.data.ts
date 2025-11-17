
import { Invoice } from '../types';

export const initialInvoices: Invoice[] = [
    { id: 'inv_1', date: '2024-07-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_2', date: '2024-06-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_3', date: '2024-05-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_4', date: '2024-04-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_5', date: '2024-03-01', amount: 49.00, status: 'Failed' },
];
