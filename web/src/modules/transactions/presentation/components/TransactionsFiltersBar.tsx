'use client';

import type { TransactionFilters } from '../../domain/types';
import type { Account } from '@/modules/accounts/domain/types';

interface TransactionsFiltersBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  accounts: Account[];
}

const barStyle: React.CSSProperties = {
  background: '#111827',
  border: '1px solid #1e293b',
  borderRadius: '12px',
  padding: '16px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  alignItems: 'end',
};

const inputStyle: React.CSSProperties = {
  background: '#1a2332',
  border: '1px solid #2d3748',
  color: '#e2e8f0',
  borderRadius: '8px',
  padding: '8px 12px',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.75rem',
  fontWeight: 500,
  marginBottom: '4px',
  display: 'block',
};

const clearButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #2d3748',
  color: '#94a3b8',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '0.875rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export function TransactionsFiltersBar({
  filters,
  onFiltersChange,
  onClearFilters,
  accounts,
}: TransactionsFiltersBarProps) {
  const hasActiveFilters =
    filters.accountId !== null ||
    filters.type !== 'TODOS' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <div style={barStyle}>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>Cuenta</label>
          <select
            style={inputStyle}
            value={filters.accountId?.toString() ?? 'TODOS'}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                accountId: e.target.value === 'TODOS' ? null : parseInt(e.target.value),
              })
            }
          >
            <option value="TODOS">Todas las cuentas</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id.toString()}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tipo</label>
          <select
            style={inputStyle}
            value={filters.type}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                type: e.target.value as 'TODOS' | 'INCOME' | 'EXPENSE',
              })
            }
          >
            <option value="TODOS">Todos</option>
            <option value="INCOME">Ingresos</option>
            <option value="EXPENSE">Gastos</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Desde</label>
          <input
            type="date"
            style={inputStyle}
            value={filters.dateFrom}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: e.target.value })
            }
          />
        </div>

        <div>
          <label style={labelStyle}>Hasta</label>
          <input
            type="date"
            style={inputStyle}
            value={filters.dateTo}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: e.target.value })
            }
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={clearButtonStyle} onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
