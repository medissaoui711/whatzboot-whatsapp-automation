import React from 'react';

export type BadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'gold'
  | 'purple'
  | 'primary'
  | 'secondary'
  | 'bot';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | string;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, { container: string; dot: string }> = {
  default: {
    container: 'bg-dark-surface-elevated text-dark-text-secondary border-dark-border',
    dot: 'bg-zinc-400',
  },
  success: {
    container: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  warning: {
    container: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    dot: 'bg-amber-400',
  },
  info: {
    container: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    dot: 'bg-sky-400',
  },
  danger: {
    container: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    dot: 'bg-rose-400',
  },
  gold: {
    container: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold',
    dot: 'bg-amber-300',
  },
  purple: {
    container: 'bg-purple-500/15 text-purple-300 border-purple-500/30 font-medium',
    dot: 'bg-purple-400',
  },
  primary: {
    container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-medium',
    dot: 'bg-emerald-400',
  },
  secondary: {
    container: 'bg-dark-surface-elevated text-dark-text-secondary border-dark-border',
    dot: 'bg-zinc-400',
  },
  bot: {
    container: 'bg-whatsapp-green/15 text-whatsapp-green border-whatsapp-green/30 font-bold',
    dot: 'bg-whatsapp-green',
  },
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const styles = variantStyles[variant as string] || variantStyles.default;
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.2 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${styles.container} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${styles.dot}`} />}
      {children}
    </span>
  );
};

export default Badge;
