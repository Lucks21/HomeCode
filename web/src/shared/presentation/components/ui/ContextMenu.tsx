'use client';

import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  open: boolean;
  onClose: () => void;
}

export function ContextMenu({ items, open, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          background: 'rgba(0,0,0,0.3)',
        }}
        onClick={onClose}
      />
      {/* Menu */}
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 160,
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '6px 0',
          minWidth: 180,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: item.color || '#e2e8f0',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {item.icon && <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
