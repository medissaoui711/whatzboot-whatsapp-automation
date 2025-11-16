import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import Toast from '../ui/Toast';
import { useLanguage } from '../../i18n/LanguageContext';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, options?: { type?: ToastType, duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { dir } = useLanguage();

  const addToast = useCallback((message: string, options: { type?: ToastType, duration?: number } = {}) => {
    const { type = 'info', duration = 4000 } = options;
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  const positionClass = dir === 'rtl' ? 'left-5' : 'right-5';

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={`fixed top-5 ${positionClass} z-[100] space-y-3`}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};