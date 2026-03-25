import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'outline' | 'secondary' | 'warning';
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    background: 'rgba(16,185,129,0.15)',
    color: '#10b981',
  },
  success: {
    background: 'rgba(16,185,129,0.15)',
    color: '#10b981',
  },
  destructive: {
    background: 'rgba(239,68,68,0.15)',
    color: '#ef4444',
  },
  warning: {
    background: 'rgba(251,191,36,0.15)',
    color: '#fbbf24',
  },
  outline: {
    background: 'transparent',
    border: '1px solid #2d3748',
    color: '#94a3b8',
  },
  secondary: {
    background: 'rgba(59,130,246,0.15)',
    color: '#3b82f6',
  },
};

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 20,
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1,
        ...(variantStyles[variant] ?? {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
