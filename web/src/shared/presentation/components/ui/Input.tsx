import React, { useState } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  className?: string;
  value?: string | number | readonly string[] | number[] | boolean | null;
}

export function Input({ className, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    display: 'flex',
    height: 40,
    width: '100%',
    background: '#1a2332',
    border: focused ? '1px solid #3b82f6' : '1px solid #2d3748',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '8px 12px',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <input
      style={inputStyle}
      onFocus={(e) => {
        setFocused(true);
        // Auto-select "0" so typing replaces it immediately
        if (e.target.value === '0') {
          e.target.select();
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
}
