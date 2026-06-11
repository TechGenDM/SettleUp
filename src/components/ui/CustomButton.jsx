import React from 'react';
import { cn } from '../../utils/cn';

const CustomButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const variants = {
    primary:   'bg-brand-primary text-white shadow-glow-primary hover:bg-brand-hover',
    secondary: 'bg-bg-secondary text-text-primary border border-border shadow-sm hover:bg-bg-hover hover:border-text-muted',
    ghost:     'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover',
    danger:    'bg-error text-white shadow-glow-primary hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1',
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={15} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

export default CustomButton;
