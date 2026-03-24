'use client';

import type { Debt } from '../../domain/types';

interface DebtDetailCardProps {
  debt: Debt;
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

export function DebtDetailCard({ debt }: DebtDetailCardProps) {
  const paid = debt.amount - debt.remainingAmount;
  const progressPercent = debt.amount > 0 ? Math.round((paid / debt.amount) * 100) : 0;
  const status = statusStyles[debt.status] ?? statusStyles.PENDING;

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Top row: description + status badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 4,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>
          {debt.description}
        </h3>
        <span
          style={{
            background: status.background,
            color: status.color,
            padding: '4px 14px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Date */}
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20, marginTop: 4 }}>
        Creada el {formatDate(debt.date)}
      </p>

      {/* Amounts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Monto original</p>
          <p style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {formatCLP(debt.amount)}
          </p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Pagado</p>
          <p style={{ color: '#10b981', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {formatCLP(paid)}
          </p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Pendiente</p>
          <p style={{ color: '#fb923c', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {formatCLP(debt.remainingAmount)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          <span style={{ color: '#94a3b8' }}>Progreso</span>
          <span style={{ color: '#94a3b8' }}>{progressPercent}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: '#2d3748',
            overflow: 'hidden',
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
      </div>

      {/* Payment history */}
      {debt.payments && debt.payments.length > 0 && (
        <div>
          <h4 style={{ fontWeight: 700, color: '#ffffff', fontSize: 15, marginBottom: 12, marginTop: 0 }}>
            Historial de pagos
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {debt.payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#0b0f19',
                  borderRadius: 10,
                  border: '1px solid #1e293b',
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: 14 }}>
                  {formatDate(payment.date)}
                </span>
                <span style={{ color: '#10b981', fontWeight: 600, fontSize: 14 }}>
                  {formatCLP(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No payments message */}
      {(!debt.payments || debt.payments.length === 0) && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Sin pagos registrados
          </p>
        </div>
      )}
    </div>
  );
}
