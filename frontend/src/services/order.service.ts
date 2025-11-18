import request from './api';
import { Order, BackendOrder, OrderItem, BackendOrderItem } from '@/types';

const transformOrderItem = (item: BackendOrderItem): OrderItem => ({
  id: item.product.id,
  name: item.product.name,
  quantity: item.quantity,
  price: item.price_at_order_time,
});


const transformBackendOrder = (backendOrder: BackendOrder): Order => {
  return {
    id: `ORD-${backendOrder.id}`,
    customer: {
      name: backendOrder.customer_phone, // Using phone as name for now
      phone: backendOrder.customer_phone,
    },
    items: backendOrder.items.map(transformOrderItem),
    total: backendOrder.total_price,
    status: backendOrder.status,
    createdAt: backendOrder.created_at,
  };
};

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const backendOrders = await request<BackendOrder[]>('/orders/');
    return backendOrders.map(transformBackendOrder);
  },
};
