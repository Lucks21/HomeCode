import React, { useState } from 'react';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchInput({ value, onChange, placeholder, className, style }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      <span
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b',
          fontSize: 14,
          pointerEvents: 'none',
        }}
      >
        &#128269;
      </span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: 'flex',
          height: 40,
          width: '100%',
          background: '#1a2332',
          border: focused ? '1px solid #3b82f6' : '1px solid #2d3748',
          borderRadius: 8,
          color: '#e2e8f0',
          paddingLeft: 36,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}
