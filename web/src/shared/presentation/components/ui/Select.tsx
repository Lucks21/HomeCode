import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => undefined,
});

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div style={{ position: 'relative' }}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      style={{
        display: 'flex',
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1a2332',
        border: '1px solid #2d3748',
        borderRadius: 8,
        color: '#e2e8f0',
        padding: '8px 12px',
        fontSize: 14,
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
      <span style={{ marginLeft: 8, color: '#64748b' }}>&#9662;</span>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return (
    <span style={{ color: value ? '#e2e8f0' : '#64748b' }}>
      {value ?? placeholder}
    </span>
  );
}

export function SelectContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { open, setOpen } = React.useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        zIndex: 50,
        minWidth: '100%',
        marginTop: 4,
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        overflowY: 'auto',
        maxHeight: 240,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { onValueChange, setOpen } = React.useContext(SelectContext);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        fontSize: 14,
        color: '#e2e8f0',
        cursor: 'pointer',
        userSelect: 'none',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'background 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}
