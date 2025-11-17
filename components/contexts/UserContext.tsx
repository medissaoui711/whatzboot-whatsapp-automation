import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../../types';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleBetaStatus: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a saved session in localStorage on initial load
    try {
        const savedUser = localStorage.getItem('whatzboot-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('whatzboot-user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // Mock authentication logic
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.toLowerCase() === 'admin@whatzboot.com' && password === 'password') {
                const userData: User = {
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@whatzboot.com',
                    role: 'Admin',
                    avatar: 'https://picsum.photos/seed/admin/100',
                    betaTester: JSON.parse(localStorage.getItem('whatzboot-beta-tester') || 'false'),
                };
                localStorage.setItem('whatzboot-user', JSON.stringify(userData));
                setUser(userData);
                resolve();
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('whatzboot-user');
    setUser(null);
    // Navigation to /login will happen automatically in App.tsx
  }, []);

  const toggleBetaStatus = useCallback(() => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const newBetaStatus = !currentUser.betaTester;
        const updatedUser = { ...currentUser, betaTester: newBetaStatus };
        localStorage.setItem('whatzboot-beta-tester', JSON.stringify(newBetaStatus));
        localStorage.setItem('whatzboot-user', JSON.stringify(updatedUser)); // Update persisted user
        return updatedUser;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, toggleBetaStatus, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};