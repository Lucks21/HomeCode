import React, { useState } from 'react';

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const typeStyles: Record<string, React.CSSProperties> = {
  success: {
    background: '#065f46',
    border: '1px solid #10b981',
    color: '#a7f3d0',
  },
  error: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fca5a5',
  },
  info: {
    background: '#1e3a5f',
    border: '1px solid #3b82f6',
    color: '#93c5fd',
  },
  warning: {
    background: '#713f12',
    border: '1px solid #fbbf24',
    color: '#fde68a',
  },
};

export function Toast({ id, type, message, onClose }: ToastItemProps) {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        minWidth: 280,
        ...(typeStyles[type] ?? {}),
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
      <button
        onClick={() => onClose(id)}
        onMouseEnter={() => setCloseHovered(true)}
        onMouseLeave={() => setCloseHovered(false)}
        style={{
          marginLeft: 16,
          background: 'none',
          border: 'none',
          color: 'inherit',
          opacity: closeHovered ? 1 : 0.7,
          cursor: 'pointer',
          fontSize: 14,
          padding: 0,
          lineHeight: 1,
          transition: 'opacity 0.15s',
        }}
        aria-label="Cerrar"
      >
        &#10005;
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}
