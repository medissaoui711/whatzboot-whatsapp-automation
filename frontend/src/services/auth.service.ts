import request from './api';
import { Token, User, UserCreate, UserLogin } from '@/types';

// The User object returned by the backend /users/me endpoint
interface BackendUser {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
}

const transformBackendUser = (backendUser: BackendUser): User => {
    return {
        ...backendUser,
        name: backendUser.email.split('@')[0], // Derive name from email
        avatar: `https://i.pravatar.cc/150?u=${backendUser.email}`, // Generate a consistent avatar
        plan: 'premium', // Assign a default plan for the frontend
    };
};

export const authService = {
  login: async (credentials: UserLogin): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return request<Token>('/login/access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  },

  register: async (userData: UserCreate): Promise<User> => {
    const backendUser = await request<BackendUser>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return transformBackendUser(backendUser);
  },

  getCurrentUser: async (): Promise<User> => {
    const backendUser = await request<BackendUser>('/users/me');
    return transformBackendUser(backendUser);
  },
};
