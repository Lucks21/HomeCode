import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  registerOption: (value: string, label: string) => void;
  labelMap: Map<string, string>;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => undefined,
  registerOption: () => undefined,
  labelMap: new Map(),
});

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [labelMap, setLabelMap] = useState<Map<string, string>>(new Map());

  const registerOption = useCallback((optValue: string, label: string) => {
    setLabelMap((prev) => {
      if (prev.get(optValue) === label) return prev;
      const next = new Map(prev);
      next.set(optValue, label);
      return next;
    });
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, registerOption, labelMap }}>
      <div style={{ position: 'relative' }}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
  style,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => !disabled && setOpen(!open)}
      disabled={disabled}
      style={{
        display: 'flex',
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: disabled ? '#0f1419' : '#1a2332',
        border: '1px solid #2d3748',
        borderRadius: 8,
        color: disabled ? '#475569' : '#e2e8f0',
        padding: '8px 12px',
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
      <span style={{ marginLeft: 8, color: '#64748b' }}>&#9662;</span>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, labelMap } = React.useContext(SelectContext);
  const displayText = value != null && value !== '' ? (labelMap.get(value) ?? value) : undefined;
  return (
    <span style={{ color: displayText ? '#e2e8f0' : '#64748b' }}>
      {displayText ?? placeholder}
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

  return (
    <div
      ref={ref}
      style={{
        display: open ? 'block' : 'none',
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
  const { onValueChange, setOpen, registerOption } = React.useContext(SelectContext);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (typeof children === 'string') {
      registerOption(value, children);
    }
  }, [value, children, registerOption]);

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
