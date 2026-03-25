'use client';

import type { Installment } from '../../domain/types';

interface InstallmentsTableProps {
  installments: Installment[];
  onViewDetail: (installment: Installment) => void;
  onPay: (installment: Installment) => void;
  onArchive: (installment: Installment) => void;
  onUnarchive?: (installment: Installment) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

export function InstallmentsTable({
  installments,
  onViewDetail,
  onPay,
  onArchive,
  onUnarchive,
}: InstallmentsTableProps) {
  if (installments.length === 0) {
    return (
      <div style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 16,
        padding: 48,
        textAlign: 'center',
      }}>
        <div style={{
          width: 64,
          height: 64,
          border: '2px solid #1e293b',
          borderRadius: 12,
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 24, color: '#64748b' }}>$</span>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#f1f5f9' }}>
          Sin resultados
        </h3>
        <p style={{ color: '#64748b', margin: 0 }}>
          No se encontraron cuotas registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-cards-2">

      {installments.map((inst) => {
        const paidCount = inst.paidCount ?? 0;
        const total = inst.totalInstallments;
        const percent = inst.progressPercentage ?? (total > 0 ? Math.round((paidCount / total) * 100) : 0);
        const isPaidOff = paidCount >= total;
        const remaining = inst.totalAmount - (paidCount * inst.installmentValue);

        return (
          <div
            key={inst.id}
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 20,
              cursor: 'pointer',
            }}
            onClick={() => onViewDetail(inst)}
          >
            {/* Header: description + start date */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', margin: 0 }}>
                {inst.description}
              </h3>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4, margin: 0, marginBlockStart: 4 }}>
                Inicio: {formatDate(inst.startDate)}
              </p>
            </div>

            {/* Info row: Monto Total | Valor Cuota */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, marginBottom: 2 }}>Monto Total</p>
                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15, margin: 0 }}>
                  {formatCLP(inst.totalAmount)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, marginBottom: 2 }}>Valor Cuota</p>
                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15, margin: 0 }}>
                  {formatCLP(inst.installmentValue)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 8 }}>
              <div style={{
                height: 8,
                borderRadius: 4,
                background: '#2d3748',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  background: '#10b981',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Progress text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>
                {paidCount} de {total} cuotas pagadas
              </span>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{percent}%</span>
            </div>

            {/* Remaining amount */}
            <p style={{ color: '#64748b', fontSize: 13, margin: 0, marginBottom: 16 }}>
              Monto Restante: {formatCLP(remaining > 0 ? remaining : 0)}
            </p>

            {/* Action buttons */}
            <div
              style={{ display: 'flex', gap: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {inst.archived && onUnarchive ? (
                <button
                  onClick={() => onUnarchive(inst)}
                  style={{
                    border: '1px solid #10b981',
                    color: '#10b981',
                    background: 'transparent',
                    borderRadius: 8,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Desarchivar
                </button>
              ) : !isPaidOff ? (
                <button
                  onClick={() => onPay(inst)}
                  style={{
                    border: '1px solid #10b981',
                    color: '#10b981',
                    background: 'transparent',
                    borderRadius: 8,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Pagar Cuotas
                </button>
              ) : (
                <button
                  onClick={() => onArchive(inst)}
                  style={{
                    border: '1px solid #10b981',
                    color: '#10b981',
                    background: 'transparent',
                    borderRadius: 8,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
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
