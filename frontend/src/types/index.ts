// User object used throughout the frontend application
export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  name: string; // Derived from email on the frontend
  avatar?: string;
  plan: 'free' | 'pro' | 'premium'; // Frontend-specific concept for now
}

// Token from backend /login/access-token
export interface Token {
  access_token: string;
  token_type: string;
}

// Schemas for API requests
export interface UserCreate {
    email: string;
    password: string;
}

export interface UserLogin {
    username: string; // FastAPI OAuth2 uses 'username' field for email
    password: string;
}

// Navigation link type
export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

// Chart data type
export interface PerformanceData {
  name: string;
  sent: number;
  received: number;
}

// Order Management System Types - FRONTEND
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Completed' | 'Cancelled';

export interface Customer {
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// Order Management System Types - BACKEND (for transformation)
export interface BackendProduct {
    id: number;
    name: string;
    price: number;
    description: string | null;
}

export interface BackendOrderItem {
    id: number;
    quantity: number;
    price_at_order_time: number;
    product: BackendProduct;
}

export interface BackendOrder {
    id: number;
    customer_phone: string;
    total_price: number;
    status: OrderStatus;
    created_at: string;
    items: BackendOrderItem[];
}
