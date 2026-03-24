'use client';

import type { Installment } from '../../domain/types';

interface InstallmentDetailCardProps {
  installment: Installment;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

export function InstallmentDetailCard({ installment }: InstallmentDetailCardProps) {
  const paidCount = installment.paidCount ?? 0;
  const pendingCount = installment.pendingCount ?? (installment.totalInstallments - paidCount);
  const percent = installment.progressPercentage ??
    (installment.totalInstallments > 0
      ? Math.round((paidCount / installment.totalInstallments) * 100)
      : 0);

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          {installment.description}
        </h3>
      </div>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20, marginTop: 4 }}>
        Inicio: {formatDate(installment.startDate)}
      </p>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Monto total</p>
          <p style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {formatCLP(installment.totalAmount)}
          </p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Valor cuota</p>
          <p style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {formatCLP(installment.installmentValue)}
          </p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4, marginTop: 0 }}>Cuotas</p>
          <p style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>
            {paidCount}/{installment.totalInstallments}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          <span style={{ color: '#94a3b8' }}>
            Progreso ({paidCount} pagadas, {pendingCount} pendientes)
          </span>
          <span style={{ color: '#94a3b8' }}>{percent}%</span>
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
              width: `${percent}%`,
              height: '100%',
              borderRadius: 4,
              background: '#10b981',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
