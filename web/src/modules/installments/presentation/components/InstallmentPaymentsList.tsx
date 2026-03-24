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
      <div className="p-8 text-center text-muted-foreground">
        Sin cuotas registradas
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className={`border-2 p-4 rounded-md ${
            payment.paid
              ? 'border-green-500 bg-green-500/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">Cuota #{payment.installmentNumber}</span>
            {payment.paid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="font-medium">{formatCLP(payment.amount)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {payment.paid && payment.paidDate
              ? `Pagada: ${formatDate(payment.paidDate)}`
              : 'Pendiente'}
          </p>
        </div>
      ))}
    </div>
  );
}
