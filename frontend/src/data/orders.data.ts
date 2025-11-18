import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-2407-001',
    customer: {
      name: 'Ali Ahmed',
      phone: '+966 50 123 4567',
    },
    items: [
      { id: 1, name: 'Margherita Pizza', quantity: 1, price: 45 },
      { id: 2, name: 'Pepsi', quantity: 2, price: 5 },
    ],
    total: 55.00,
    status: 'Completed',
    createdAt: '2024-07-21T10:30:00Z',
  },
  {
    id: 'ORD-2407-002',
    customer: {
      name: 'Fatima Zahra',
      phone: '+966 55 987 6543',
    },
    items: [
      { id: 3, name: 'Chicken Shawarma', quantity: 2, price: 15 },
    ],
    total: 30.00,
    status: 'Preparing',
    createdAt: '2024-07-21T12:45:00Z',
  },
  {
    id: 'ORD-2407-003',
    customer: {
      name: 'Khalid Omar',
      phone: '+966 53 456 7890',
    },
    items: [
      { id: 4, name: 'Caesar Salad', quantity: 1, price: 35 },
      { id: 5, name: 'Water', quantity: 1, price: 2 },
    ],
    total: 37.00,
    status: 'Pending',
    createdAt: '2024-07-21T13:05:00Z',
  },
  {
    id: 'ORD-2407-004',
    customer: {
      name: 'Noura Saad',
      phone: '+966 54 321 0987',
    },
    items: [
      { id: 1, name: 'Margherita Pizza', quantity: 2, price: 45 },
      { id: 6, name: 'Mushroom Soup', quantity: 1, price: 25 },
    ],
    total: 115.00,
    status: 'Confirmed',
    createdAt: '2024-07-21T13:10:00Z',
  },
   {
    id: 'ORD-2407-005',
    customer: {
      name: 'Youssef Hassan',
      phone: '+966 56 789 1234',
    },
    items: [
      { id: 7, name: 'Beef Burger', quantity: 1, price: 40 },
    ],
    total: 40.00,
    status: 'Cancelled',
    createdAt: '2024-07-20T18:00:00Z',
  },
];
