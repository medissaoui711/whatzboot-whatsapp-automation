// This file handles all communication with the backend API, now with a robust client-side mock system for zero-setup deployment.

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// A utility function to get the auth token from localStorage
const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const tokenData = localStorage.getItem('whatzboot-token');
    if (!tokenData) return null;

    try {
        const token: { access_token: string } = JSON.parse(tokenData);
        return token.access_token;
    } catch (e) {
        console.error('Failed to parse token from localStorage', e);
        localStorage.removeItem('whatzboot-token');
        return null;
    }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Simulate minor network latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 300));

  // --- Client-Side Mock Layer ---
  if (endpoint.includes('/login/access-token')) {
    let email = 'your@email.com';
    if (options.body instanceof URLSearchParams) {
      email = options.body.get('username') || email;
    }
    localStorage.setItem('whatzboot-email', email);
    localStorage.setItem('whatzboot-token', JSON.stringify({
      access_token: 'mock-jwt-token-12345',
      token_type: 'bearer'
    }));
    return {
      access_token: 'mock-jwt-token-12345',
      token_type: 'bearer',
    } as unknown as T;
  }

  if (endpoint.includes('/users/me')) {
    const email = localStorage.getItem('whatzboot-email') || 'your@email.com';
    return {
      id: 1,
      email: email,
      is_active: true,
      is_superuser: true,
    } as unknown as T;
  }

  if (endpoint.startsWith('/users/') && options.method === 'POST') {
    const data = JSON.parse(options.body as string);
    localStorage.setItem('whatzboot-email', data.email);
    return {
      id: 1,
      email: data.email,
      is_active: true,
      is_superuser: true,
    } as unknown as T;
  }

  if (endpoint.includes('/orders/')) {
    // Return backend-formatted mock orders
    const backendMockOrders = [
      {
        id: 1,
        customer_phone: '+966 50 123 4567',
        total_price: 55.00,
        status: 'Completed',
        created_at: '2024-07-21T10:30:00Z',
        items: [
          { id: 1, quantity: 1, price_at_order_time: 45, product: { id: 1, name: 'بيتزا مارغريتا', price: 45, description: null } },
          { id: 2, quantity: 2, price_at_order_time: 5, product: { id: 2, name: 'بيبسي', price: 5, description: null } }
        ]
      },
      {
        id: 2,
        customer_phone: '+966 55 987 6543',
        total_price: 30.00,
        status: 'Preparing',
        created_at: '2024-07-21T12:45:00Z',
        items: [
          { id: 3, quantity: 2, price_at_order_time: 15, product: { id: 3, name: 'شاورما دجاج ثنائية', price: 15, description: null } }
        ]
      },
      {
        id: 3,
        customer_phone: '+966 53 456 7890',
        total_price: 37.00,
        status: 'Pending',
        created_at: '2024-07-21T13:05:00Z',
        items: [
          { id: 4, quantity: 1, price_at_order_time: 35, product: { id: 4, name: 'سلطة سيزر', price: 35, description: null } },
          { id: 5, quantity: 1, price_at_order_time: 2, product: { id: 5, name: 'مياه معدنية', price: 2, description: null } }
        ]
      },
      {
        id: 4,
        customer_phone: '+966 54 321 0987',
        total_price: 115.00,
        status: 'Confirmed',
        created_at: '2024-07-21T13:10:00Z',
        items: [
          { id: 1, quantity: 2, price_at_order_time: 45, product: { id: 1, name: 'بيتزا مارغريتا', price: 45, description: null } },
          { id: 6, quantity: 1, price_at_order_time: 25, product: { id: 6, name: 'شوربة فطر', price: 25, description: null } }
        ]
      }
    ];
    return backendMockOrders as unknown as T;
  }

  // General fallback for unmocked routes
  if (endpoint.endsWith('/')) {
    return [] as unknown as T;
  }
  return {} as unknown as T;
}

export default request;
