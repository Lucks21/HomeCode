import React from 'react';

interface ModulePageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ModulePageHeader({
  title,
  description,
  actions,
  className,
  style,
}: ModulePageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        ...style,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#f1f5f9',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              marginTop: 4,
              fontSize: 14,
              color: '#64748b',
              margin: '4px 0 0 0',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
