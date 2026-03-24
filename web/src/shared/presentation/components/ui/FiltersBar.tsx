import React from 'react';

interface FiltersBarProps {
  children: React.ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export function FiltersBar({
  children,
  hasActiveFilters,
  onClearFilters,
  className = '',
}: FiltersBarProps) {
  return (
    <div className={`p-4 border-2 border-foreground bg-card ${className}`}>
      {children}
      {hasActiveFilters && onClearFilters && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
