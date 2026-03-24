import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 mt-4 ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded border-2 border-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
      >
        ← Anterior
      </button>
      <span className="text-sm px-2">
        Página {currentPage} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded border-2 border-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
      >
        Siguiente →
      </button>
    </div>
  );
}
