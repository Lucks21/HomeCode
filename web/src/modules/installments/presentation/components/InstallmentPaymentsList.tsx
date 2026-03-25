'use client';

import { Check, Clock } from 'lucide-react';
import type { InstallmentPayment } from '../../domain/types';

interface InstallmentPaymentsListProps {
  payments: InstallmentPayment[];
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

export function InstallmentPaymentsList({ payments }: InstallmentPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
        Sin cuotas registradas
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}
    >
      {payments.map((payment) => (
        <div
          key={payment.id}
          style={{
            background: '#111827',
            border: payment.paid
              ? '1px solid #10b981'
              : '1px solid #1e293b',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
              Cuota #{payment.installmentNumber}
            </span>
            {payment.paid ? (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check style={{ width: 14, height: 14, color: '#10b981' }} />
              </div>
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(100,116,139,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock style={{ width: 14, height: 14, color: '#64748b' }} />
              </div>
            )}
          </div>
          <p style={{ fontWeight: 500, color: '#f1f5f9', margin: 0, marginBottom: 4 }}>
            {formatCLP(payment.amount)}
          </p>
          <p
            style={{
              fontSize: 12,
              margin: 0,
              color: payment.paid ? '#10b981' : '#64748b',
            }}
          >
            {payment.paid && payment.paidDate
              ? `Pagada: ${formatDate(payment.paidDate)}`
              : 'Pendiente'}
          </p>
        </div>
      ))}
    </div>
  );
}
