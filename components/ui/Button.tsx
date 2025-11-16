import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'sm';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', icon, ...props }) => {
  const baseClasses = "rounded-lg font-semibold flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-whatsapp-green text-white hover:bg-whatsapp-teal-green',
    secondary: 'bg-dark-border text-dark-text-primary hover:bg-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
      normal: 'px-4 py-2',
      sm: 'px-3 py-1 text-sm'
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`} {...props}>
      {icon && <span className="me-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
