import React from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '16px',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }}
        onClick={() => onOpenChange?.(false)}
      />
      <div style={{ position: 'relative', zIndex: 50 }}>{children}</div>
    </div>
  );
}

export function DialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 16,
        color: '#e2e8f0',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        padding: 16,
        width: '100%',
        maxWidth: 512,
        maxHeight: 'calc(100vh - 24px)',
        overflowY: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      style={{
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        color: '#f1f5f9',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontSize: 14,
        color: '#64748b',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
