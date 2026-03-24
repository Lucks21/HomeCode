import React, { useState } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
  style,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        ...style,
      }}
    >
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
      >
        &larr; Anterior
      </PaginationButton>
      <span style={{ fontSize: 14, color: '#94a3b8', padding: '0 8px' }}>
        Pagina {currentPage} de {totalPages}
      </span>
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
      >
        Siguiente &rarr;
      </PaginationButton>
    </div>
  );
}

function PaginationButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && !disabled ? 'rgba(255,255,255,0.05)' : '#111827',
        border: '1px solid #2d3748',
        color: '#e2e8f0',
        borderRadius: 8,
        padding: '4px 12px',
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, opacity 0.15s',
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
}
