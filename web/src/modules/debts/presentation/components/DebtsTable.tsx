'use client';

import type { Debt } from '../../domain/types';
import type { Account } from '@/modules/accounts/domain/types';

interface DebtsTableProps {
  debts: Debt[];
  accounts: Account[];
  onViewDetail: (debt: Debt) => void;
  onRegisterPayment: (debt: Debt) => void;
  onArchive: (debt: Debt) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

const statusStyles: Record<string, { label: string; background: string; color: string }> = {
  PENDING: { label: 'Pendiente', background: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  PARTIAL: { label: 'Parcial', background: 'rgba(251,146,60,0.15)', color: '#fb923c' },
  PAID: { label: 'Pagada', background: 'rgba(16,185,129,0.15)', color: '#10b981' },
};

export function DebtsTable({ debts, accounts, onViewDetail, onRegisterPayment, onArchive }: DebtsTableProps) {
  const getAccountName = (accountId: number): string => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.name ?? 'Sin cuenta';
  };

  if (debts.length === 0) {
    return (
      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#1e293b',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 28, color: '#64748b' }}>$</span>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#ffffff' }}>
          Sin resultados
        </h3>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          No se encontraron deudas con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
      }}
    >
      {debts.map((debt) => {
        const status = statusStyles[debt.status] ?? statusStyles.PENDING;
        const paid = debt.amount - debt.remainingAmount;
        const progressPercent = debt.amount > 0 ? Math.round((paid / debt.amount) * 100) : 0;
        const accountName = getAccountName(debt.accountId);

        return (
          <div
            key={debt.id}
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 20,
              cursor: 'pointer',
            }}
            onClick={() => onViewDetail(debt)}
          >
            {/* Top row: person name + status badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: '#ffffff' }}>
                {accountName}
              </span>
              <span
                style={{
                  background: status.background,
                  color: status.color,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {status.label}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 4 }}>
              {debt.description}
            </p>

            {/* Date */}
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
              {formatDate(debt.date)}
            </p>

            {/* Paid and Total amounts */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: 14 }}>
                Pagado: <span style={{ color: '#10b981', fontWeight: 600 }}>{formatCLP(paid)}</span>
              </span>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>
                Total: <span style={{ color: '#ffffff', fontWeight: 600 }}>{formatCLP(debt.amount)}</span>
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                background: '#2d3748',
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: '#10b981',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {debt.status !== 'PAID' ? (
                <button
                  onClick={() => onRegisterPayment(debt)}
                  style={{
                    flex: 1,
                    border: '1px solid #10b981',
                    color: '#10b981',
                    background: 'transparent',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(16,185,129,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  Registrar Pago
                </button>
              ) : (
                <button
                  onClick={() => onArchive(debt)}
                  style={{
                    flex: 1,
                    border: '1px solid #64748b',
                    color: '#64748b',
                    background: 'transparent',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(100,116,139,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  Archivar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
