import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'outline' | 'secondary';
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-foreground text-foreground bg-transparent',
  secondary: 'bg-secondary text-secondary-foreground',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant] ?? ''} ${className}`}
    >
      {children}
    </span>
  );
}
