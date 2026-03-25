'use client';

import { useState, useEffect, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
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
  includeArchived: false,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '24px',
};

const titleStyle: React.CSSProperties = {
  color: '#f1f5f9',
  fontSize: '1.75rem',
  fontWeight: 700,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '0.9rem',
  marginTop: '4px',
};

const greenButtonStyle: React.CSSProperties = {
  background: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background 0.15s',
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '16px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '10px',
  color: '#ef4444',
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
    unarchiveTransaction,
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

  // Refetch when includeArchived changes
  useEffect(() => {
    fetchTransactions(filters.includeArchived ? { includeArchived: true } : undefined);
  }, [filters.includeArchived, fetchTransactions]);

  // Apply client-side filters
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
    setFilters({ ...defaultFilters, includeArchived: filters.includeArchived });
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
      if (filters.includeArchived) {
        await fetchTransactions({ includeArchived: true });
      }
    } catch (err) {
      console.error('Error al archivar transaccion:', err);
    }
  };

  const handleUnarchive = async (transaction: Transaction) => {
    try {
      await unarchiveTransaction(transaction.id);
      await fetchTransactions({ includeArchived: filters.includeArchived });
    } catch (err) {
      console.error('Error al desarchivar transaccion:', err);
    }
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      if (selectedTransaction) {
        const { accountId, ...updateData } = data;
        await updateTransaction(selectedTransaction.id, updateData);
      } else {
        await createTransaction(data);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al guardar transaccion');
      console.error(errorMessage);
    }
  };

  return (
    <>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Transacciones</h1>
          <p style={subtitleStyle}>Gestiona los ingresos y gastos de tus cuentas</p>
        </div>
        <button
          style={greenButtonStyle}
          onClick={handleCreate}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#059669';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#10b981';
          }}
        >
          + Nuevo Movimiento
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <TransactionsFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          accounts={accounts}
        />
        <div style={{ marginTop: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.includeArchived ?? false}
              onChange={(e) => setFilters({ ...filters, includeArchived: e.target.checked })}
              style={{ accentColor: '#10b981' }}
            />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Ver archivados</span>
          </label>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={errorBoxStyle}>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Error:</p>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Transactions List */}
      <div style={{ marginTop: '8px' }}>
        <TransactionsTable
          transactions={filteredTransactions}
          accounts={accounts}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
        />
      </div>

      {/* Form Modal */}
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
