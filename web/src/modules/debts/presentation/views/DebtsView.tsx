'use client';

import { useState, useEffect, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { ModulePageHeader } from '@/shared/presentation/components/ModulePageHeader';
import { Button } from '@/shared/presentation/components/ui/Button';
import { FiltersBar } from '@/shared/presentation/components/ui/FiltersBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/Select';
import { Input } from '@/shared/presentation/components/ui/Input';
import { DebtsTable } from '../components/DebtsTable';
import { DebtFormModal } from '../components/DebtFormModal';
import { DebtPaymentModal } from '../components/DebtPaymentModal';
import { DebtDetailCard } from '../components/DebtDetailCard';
import { useDebts } from '../hooks/useDebts';
import { useDebtDetail } from '../hooks/useDebtDetail';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import type { Account } from '@/modules/accounts/domain/types';
import type { Debt, DebtFilters } from '../../domain/types';
import type { DebtFormData } from '../../application/validations/debt.schema';
import type { DebtPaymentFormData } from '../../application/validations/debtPayment.schema';

const defaultFilters: DebtFilters = {
  accountId: null,
  status: 'TODOS',
  dateFrom: '',
  dateTo: '',
};

export function DebtsView() {
  const [filters, setFilters] = useState<DebtFilters>(defaultFilters);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [detailDebtId, setDetailDebtId] = useState<number | null>(null);

  const {
    debts,
    isLoading,
    error,
    fetchDebts,
    createDebt,
    registerPayment,
    archiveDebt,
  } = useDebts();

  const { debt: debtDetail, refetch: refetchDetail } = useDebtDetail(detailDebtId);

  // Fetch accounts for selectors
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await accountsRepository.getAll();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    loadAccounts();
  }, []);

  // Apply filters
  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      if (filters.accountId && d.accountId !== filters.accountId) return false;
      if (filters.status !== 'TODOS' && d.status !== filters.status) return false;
      if (filters.dateFrom && d.date < filters.dateFrom) return false;
      if (filters.dateTo && d.date > filters.dateTo) return false;
      return true;
    });
  }, [debts, filters]);

  const hasActiveFilters =
    filters.accountId !== null ||
    filters.status !== 'TODOS' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const handleClearFilters = () => setFilters(defaultFilters);

  const handleCreate = () => setIsFormModalOpen(true);

  const handleViewDetail = (debt: Debt) => {
    setDetailDebtId(debt.id);
  };

  const handleCloseDetail = () => {
    setDetailDebtId(null);
  };

  const handleRegisterPayment = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsPaymentModalOpen(true);
  };

  const handleArchive = async (debt: Debt) => {
    try {
      await archiveDebt(debt.id);
    } catch (err) {
      console.error('Error al archivar deuda:', err);
    }
  };

  const handleFormSubmit = async (data: DebtFormData) => {
    try {
      await createDebt(data);
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al crear deuda');
      console.error(errorMessage);
    }
  };

  const handlePaymentSubmit = async (data: DebtPaymentFormData) => {
    if (!selectedDebt) return;
    try {
      await registerPayment(selectedDebt.id, data);
      setIsPaymentModalOpen(false);
      if (detailDebtId === selectedDebt.id) {
        refetchDetail();
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al registrar pago');
      console.error(errorMessage);
    }
  };

  // If viewing detail, show detail view
  if (detailDebtId && debtDetail) {
    return (
      <>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={handleCloseDetail}>
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Detalle de Deuda</h1>
        </div>

        <DebtDetailCard debt={debtDetail} />

        {debtDetail.status !== 'PAID' && (
          <div className="mt-4">
            <Button onClick={() => handleRegisterPayment(debtDetail)}>
              Registrar Pago
            </Button>
          </div>
        )}

        <DebtPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
          debt={selectedDebt}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <ModulePageHeader
        title="Deudas"
        description="Gestiona tus deudas y registra pagos"
        actions={
          <Button onClick={handleCreate}>
            + Nueva Deuda
          </Button>
        }
      />

      <div className="mt-4">
        <FiltersBar hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select
                value={filters.accountId?.toString() ?? 'TODOS'}
                onValueChange={(value) =>
                  setFilters({ ...filters, accountId: value === 'TODOS' ? null : parseInt(value) })
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
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value as 'TODOS' | 'PENDING' | 'PARTIAL' | 'PAID',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="PARTIAL">Parcial</SelectItem>
                  <SelectItem value="PAID">Pagada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: (e.target as HTMLInputElement).value })
                }
              />
            </div>

            <div>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: (e.target as HTMLInputElement).value })
                }
              />
            </div>
          </div>
        </FiltersBar>
      </div>

      {error && (
        <div className="mt-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        <DebtsTable
          debts={filteredDebts}
          onViewDetail={handleViewDetail}
          onRegisterPayment={handleRegisterPayment}
          onArchive={handleArchive}
        />
      </div>

      <DebtFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        accounts={accounts}
        isLoading={isLoading}
      />

      <DebtPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        debt={selectedDebt}
        isLoading={isLoading}
      />
    </>
  );
}
