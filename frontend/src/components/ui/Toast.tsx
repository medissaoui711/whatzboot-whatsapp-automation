'use client';
import React, { useEffect, useState } from 'react';
import { ToastMessage, useToast } from '@/contexts/ToastContext';

const icons = {
  success: 'fa-solid fa-check-circle',
  error: 'fa-solid fa-times-circle',
  info: 'fa-solid fa-info-circle',
  warning: 'fa-solid fa-exclamation-triangle',
};

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-600',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => removeToast(toast.id), 500); // Wait for animation
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, removeToast]);
  
  const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => removeToast(toast.id), 500);
  };

  const animationClass = isExiting ? 'animate-toast-out' : `animate-toast-in-${toast.position === 'top-left' || toast.position === 'bottom-left' ? 'left' : 'right'}`;

  return (
    <div
      className={`relative mb-4 flex w-full max-w-sm items-center gap-4 overflow-hidden rounded-md p-4 text-white shadow-lg ${bgColors[toast.type]} ${animationClass}`}
      role="alert"
    >
      <i className={`text-xl ${icons[toast.type]}`}></i>
      <div className="flex-grow">
        <h4 className="font-bold">{toast.title}</h4>
        {toast.message && <p className="text-sm">{toast.message}</p>}
      </div>
       <button onClick={handleClose} className="absolute top-2 right-2 text-white/70 hover:text-white">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;
