'use client';

import { useState, useEffect, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
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
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={handleCloseDetail}
            style={{
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#94a3b8',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            ← Volver
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Detalle de Deuda
          </h1>
        </div>

        <DebtDetailCard debt={debtDetail} />

        {debtDetail.status !== 'PAID' && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => handleRegisterPayment(debtDetail)}
              style={{
                border: '1px solid #10b981',
                color: '#10b981',
                background: 'transparent',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Registrar Pago
            </button>
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Deudas
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Gestiona tus deudas y registra pagos
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = '#059669';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = '#10b981';
          }}
        >
          + Nueva Deuda
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            alignItems: 'end',
          }}
        >
          {/* Account filter */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Cuenta
            </label>
            <select
              value={filters.accountId?.toString() ?? 'TODOS'}
              onChange={(e) =>
                setFilters({ ...filters, accountId: e.target.value === 'TODOS' ? null : parseInt(e.target.value) })
              }
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="TODOS">Todas las cuentas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id.toString()}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as 'TODOS' | 'PENDING' | 'PARTIAL' | 'PAID',
                })
              }
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="TODOS">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="PARTIAL">Parcial</option>
              <option value="PAID">Pagada</option>
            </select>
          </div>

          {/* Date from */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>

          {/* Date to */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <button
              onClick={handleClearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            color: '#ef4444',
          }}
        >
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Error:</p>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Debts Grid */}
      <DebtsTable
        debts={filteredDebts}
        accounts={accounts}
        onViewDetail={handleViewDetail}
        onRegisterPayment={handleRegisterPayment}
        onArchive={handleArchive}
      />

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
