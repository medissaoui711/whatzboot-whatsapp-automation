'use client';
import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { User, Token, UserLogin } from '../types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyTokenAndFetchUser = useCallback(async () => {
    const tokenData = localStorage.getItem('whatzboot-token');
    if (tokenData) {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user, token might be invalid.", error);
        localStorage.removeItem('whatzboot-token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    verifyTokenAndFetchUser();
  }, [verifyTokenAndFetchUser]);

  const login = async (credentials: UserLogin) => {
    const token: Token = await authService.login(credentials);
    localStorage.setItem('whatzboot-token', JSON.stringify(token));
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem('whatzboot-token');
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
