'use client';

import { FiltersBar } from '@/shared/presentation/components/ui/FiltersBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/Select';
import { Input } from '@/shared/presentation/components/ui/Input';
import type { TransactionFilters } from '../../domain/types';
import type { Account } from '@/modules/accounts/domain/types';

interface TransactionsFiltersBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  accounts: Account[];
}

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
    <FiltersBar hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Select
            value={filters.accountId?.toString() ?? 'TODOS'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                accountId: value === 'TODOS' ? null : parseInt(value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Cuenta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas las cuentas</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                type: value as 'TODOS' | 'INCOME' | 'EXPENSE',
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="INCOME">Ingresos</SelectItem>
              <SelectItem value="EXPENSE">Gastos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="date"
            placeholder="Desde"
            value={filters.dateFrom}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: (e.target as HTMLInputElement).value })
            }
          />
        </div>

        <div>
          <Input
            type="date"
            placeholder="Hasta"
            value={filters.dateTo}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: (e.target as HTMLInputElement).value })
            }
          />
        </div>
      </div>
    </FiltersBar>
  );
}
