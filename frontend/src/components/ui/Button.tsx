import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'commerce' | 'gold' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const baseClasses = "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-whatsapp-green text-black hover:bg-whatsapp-green-hover shadow-sm shadow-whatsapp-green/20 focus:ring-whatsapp-green font-extrabold',
  commerce: 'bg-gradient-to-r from-whatsapp-green to-emerald-600 text-black font-extrabold hover:brightness-110 shadow-md shadow-emerald-950/40 focus:ring-emerald-500',
  gold: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold hover:brightness-110 shadow-md shadow-amber-950/40 focus:ring-amber-500',
  secondary: 'bg-dark-surface-elevated text-dark-text-primary border border-dark-border hover:bg-dark-border/80 hover:text-white focus:ring-zinc-500',
  outline: 'bg-transparent text-dark-text-primary border border-dark-border hover:border-whatsapp-green/50 hover:bg-whatsapp-green/10 hover:text-whatsapp-green focus:ring-whatsapp-green',
  ghost: 'bg-transparent text-dark-text-secondary hover:bg-dark-surface-elevated hover:text-dark-text-primary focus:ring-zinc-600',
  danger: 'bg-rose-600/90 text-white hover:bg-rose-600 shadow-sm shadow-rose-950/30 focus:ring-rose-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 min-h-[36px] text-xs gap-1.5',
  md: 'px-4 py-2.5 min-h-[42px] text-sm gap-2',
  lg: 'px-6 py-3 min-h-[48px] text-base gap-2.5',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
