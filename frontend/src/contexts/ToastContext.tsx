'use client';
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position: ToastPosition;
}

type ToastOptions = Omit<ToastMessage, 'id'>;

interface ToastContextType {
  addToast: (options: ToastOptions) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, ...options }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const positions: ToastPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {positions.map(position => (
        <div key={position} className={`fixed z-50 p-4 ${getPositionClasses(position)}`}>
          {toasts
            .filter((toast) => toast.position === position)
            .map((toast) => (
              <Toast key={toast.id} toast={toast} />
            ))}
        </div>
      ))}
    </ToastContext.Provider>
  );
};

function getPositionClasses(position: ToastPosition): string {
    switch (position) {
        case 'top-right': return 'top-0 right-0';
        case 'top-left': return 'top-0 left-0';
        case 'bottom-right': return 'bottom-0 right-0';
        case 'bottom-left': return 'bottom-0 left-0';
        default: return 'top-0 right-0';
    }
}
