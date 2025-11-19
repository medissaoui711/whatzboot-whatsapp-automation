'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type OrderTableProps = {
  orders: Order[];
};

// Define explicit styles for both the badge background/text and the dot color.
// Tailwind needs full class names to be present in the source code to generate CSS.
const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  Pending: {
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    dot: 'bg-yellow-400'
  },
  Confirmed: {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400'
  },
  Preparing: {
    badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-400'
  },
  Completed: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    dot: 'bg-green-400'
  },
  Cancelled: {
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    dot: 'bg-red-400'
  },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles.badge}`}
    >
      <span className={`mr-1.5 h-2 w-2 rounded-full ${styles.dot}`}></span>
      {status}
    </span>
  );
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  return (
    <Card className="overflow-x-auto p-0">
      <div className="min-w-full divide-y divide-dark-border">
        {/* Table Header */}
        <div className="hidden grid-cols-6 gap-4 bg-dark-card/50 px-6 py-3 font-semibold uppercase text-dark-text-secondary md:grid">
          <div className="col-span-1">Order ID</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        
        {/* Table Body */}
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-1 gap-y-4 px-6 py-4 transition-colors hover:bg-dark-border/30 md:grid-cols-6 md:gap-4"
            >
              {/* Order ID */}
              <div className="flex items-center md:col-span-1">
                <span className="font-bold text-whatsapp-green md:font-normal md:text-dark-text-primary">{order.id}</span>
              </div>
              
              {/* Customer Info */}
              <div className="md:col-span-2">
                 <p className="font-semibold text-dark-text-primary">{order.customer.name}</p>
                 <p className="text-sm text-dark-text-secondary">{order.customer.phone}</p>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between md:col-span-1 md:justify-end">
                <span className="text-sm text-dark-text-secondary md:hidden">Total:</span>
                <span className="font-semibold md:text-base">SAR {order.total.toFixed(2)}</span>
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-between md:col-span-1 md:justify-center">
                 <span className="text-sm text-dark-text-secondary md:hidden">Status:</span>
                 <StatusBadge status={order.status} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end md:col-span-1">
                <Button size="sm" variant="secondary">
                    <i className="fa-solid fa-eye mr-2"></i>
                    Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OrderTable;