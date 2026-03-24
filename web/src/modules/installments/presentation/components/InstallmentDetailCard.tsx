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
    <div className="border-2 border-foreground bg-card p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">{installment.description}</h3>
        <p className="text-sm text-muted-foreground">
          Inicio: {formatDate(installment.startDate)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Monto total</p>
          <p className="text-lg font-bold">{formatCLP(installment.totalAmount)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Valor cuota</p>
          <p className="text-lg font-bold">{formatCLP(installment.installmentValue)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Cuotas</p>
          <p className="text-lg font-bold">{paidCount}/{installment.totalInstallments}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso ({paidCount} pagadas, {pendingCount} pendientes)</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
