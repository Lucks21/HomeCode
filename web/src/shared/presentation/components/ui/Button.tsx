import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    background: '#10b981',
    color: '#ffffff',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    border: '1px solid #2d3748',
    color: '#e2e8f0',
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
  },
  destructive: {
    background: '#ef4444',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: '#1a2332',
    color: '#e2e8f0',
    border: '1px solid #2d3748',
  },
};

const variantHoverStyles: Record<string, React.CSSProperties> = {
  default: { background: '#0ea472' },
  outline: { background: 'rgba(255,255,255,0.05)' },
  ghost: { background: 'rgba(255,255,255,0.05)' },
  destructive: { background: '#dc2626' },
  secondary: { background: '#253344' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  default: { height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14 },
  sm: { height: 32, paddingLeft: 12, paddingRight: 12, fontSize: 12 },
  lg: { height: 48, paddingLeft: 24, paddingRight: 24, fontSize: 16 },
  icon: { height: 40, width: 40, padding: 0 },
};

export function Button({
  variant = 'default',
  size = 'default',
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s, opacity 0.15s',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    textDecoration: 'none',
    lineHeight: 1,
    ...(variantStyles[variant] ?? {}),
    ...(sizeStyles[size] ?? {}),
    ...(hovered && !disabled ? (variantHoverStyles[variant] ?? {}) : {}),
    ...style,
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
