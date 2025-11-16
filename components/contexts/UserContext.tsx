import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useCallback } from 'react';
import { User } from '../../types';

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  toggleBetaStatus: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demonstration purposes. In a real application, this would come from an API after login.
const initialUser: User = {
    id: '1',
    name: 'Admin User',
    email: 'admin@whatzboot.com',
    role: 'Admin', // Can be 'Admin', 'Marketer', or 'Agent' to test different views
    avatar: 'https://picsum.photos/seed/admin/100',
    betaTester: JSON.parse(localStorage.getItem('whatzboot-beta-tester') || 'false'),
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser); 

  const toggleBetaStatus = useCallback(() => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const newBetaStatus = !currentUser.betaTester;
        localStorage.setItem('whatzboot-beta-tester', JSON.stringify(newBetaStatus));
        return { ...currentUser, betaTester: newBetaStatus };
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, toggleBetaStatus }}>
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