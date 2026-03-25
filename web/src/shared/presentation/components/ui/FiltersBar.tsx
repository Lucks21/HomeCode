import React, { useState } from 'react';

interface FiltersBarProps {
  children: React.ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FiltersBar({
  children,
  hasActiveFilters,
  onClearFilters,
  className,
  style,
}: FiltersBarProps) {
  const [clearHovered, setClearHovered] = useState(false);

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
    >
      {children}
      {hasActiveFilters && onClearFilters && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClearFilters}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 14,
              color: clearHovered ? '#e2e8f0' : '#64748b',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.15s',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
