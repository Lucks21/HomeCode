'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { ModulePageHeader } from '@/shared/presentation/components/ModulePageHeader';
import { Button } from '@/shared/presentation/components/ui/Button';
import { TransactionsFiltersBar } from '../components/TransactionsFiltersBar';
import { TransactionsTable } from '../components/TransactionsTable';
import { TransactionFormModal } from '../components/TransactionFormModal';
import { useTransactions } from '../hooks/useTransactions';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import type { Account } from '@/modules/accounts/domain/types';
import type { Transaction, TransactionFilters } from '../../domain/types';
import type { TransactionFormData } from '../../application/validations/transaction.schema';

const defaultFilters: TransactionFilters = {
  accountId: null,
  type: 'TODOS',
  dateFrom: '',
  dateTo: '',
};

export function TransactionsView() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    archiveTransaction,
  } = useTransactions();

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
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.accountId && t.accountId !== filters.accountId) return false;
      if (filters.type !== 'TODOS' && t.type !== filters.type) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    });
  }, [transactions, filters]);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleCreate = () => {
    setSelectedTransaction(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormModalOpen(true);
  };

  const handleArchive = async (transaction: Transaction) => {
    try {
      await archiveTransaction(transaction.id);
    } catch (err) {
      console.error('Error al archivar transacción:', err);
    }
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al guardar transacción');
      console.error(errorMessage);
    }
  };

  return (
    <>
      <ModulePageHeader
        title="Transacciones"
        description="Gestiona los ingresos y gastos de tus cuentas"
        actions={
          <Button onClick={handleCreate}>
            + Nueva Transacción
          </Button>
        }
      />

      <div className="mt-4">
        <TransactionsFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          accounts={accounts}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        <TransactionsTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </div>

      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        transaction={selectedTransaction}
        accounts={accounts}
        isLoading={isLoading}
      />
    </>
  );
}
