import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { dir } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3500); // Auto-close slightly before the context removes it
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500); // Wait for animation to finish
  };

  const typeStyles = {
    success: {
      icon: <i className="fa-solid fa-circle-check"></i>,
      bg: 'bg-green-600/90',
      border: 'border-green-400',
    },
    error: {
      icon: <i className="fa-solid fa-circle-xmark"></i>,
      bg: 'bg-red-600/90',
      border: 'border-red-400',
    },
    info: {
      icon: <i className="fa-solid fa-circle-info"></i>,
      bg: 'bg-blue-600/90',
      border: 'border-blue-400',
    },
  };

  const { icon, bg, border } = typeStyles[type];
  const animationClass = dir === 'rtl' ? 'animate-toast-in-left' : 'animate-toast-in-right';
  
  if(isExiting) {
      // a bit of a hack to get the exit animation to work with tailwindcss jit compiler
      // since animate-toast-out is not in the config at compile time
      return (
        <div style={{animation: 'toast-out 0.5s ease-in forwards'}} className={`w-80 max-w-sm p-4 text-white rounded-lg shadow-lg border-l-4 flex items-center space-x-4 rtl:space-x-reverse backdrop-blur-sm ${bg} ${border}`}>
        <span className="text-2xl">{icon}</span>
        <p className="flex-grow">{message}</p>
        <button onClick={handleClose} className="text-xl opacity-70 hover:opacity-100">&times;</button>
      </div>
      );
  }

  return (
    <div className={`w-80 max-w-sm p-4 text-white rounded-lg shadow-lg border-l-4 flex items-center space-x-4 rtl:space-x-reverse backdrop-blur-sm ${bg} ${border} ${animationClass}`}>
      <span className="text-2xl">{icon}</span>
      <p className="flex-grow">{message}</p>
      <button onClick={handleClose} className="text-xl opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

export default Toast;
