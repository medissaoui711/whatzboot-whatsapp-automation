'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { orderService } from '@/services/order.service';
import OrderTable from './components/OrderTable';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await orderService.getOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <i className="fas fa-spinner fa-spin text-3xl text-whatsapp-green"></i>
        </div>
      );
    }

    if (error) {
       return (
         <EmptyState
            icon="fa-solid fa-exclamation-triangle"
            title="Failed to Load Orders"
            description={error}
        />
       );
    }

    if (orders.length === 0) {
      return (
        <EmptyState
            icon="fa-solid fa-receipt"
            title="No Orders Found"
            description="When a new order is received via WhatsApp, it will appear here."
        >
             <Button variant="secondary">
                <i className="fa-solid fa-book mr-2"></i>
                Learn How to Set Up
            </Button>
        </EmptyState>
      );
    }
    
    return <OrderTable orders={orders} />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Manage Orders</h1>
          <p className="mt-1 text-dark-text-secondary">View and process incoming customer orders.</p>
        </div>
        <Button>
            <i className="fa-solid fa-plus mr-2"></i>
            New Order
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default OrdersPage;
