'use client';

import { Badge } from '@/shared/presentation/components/ui/Badge';
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

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'destructive' | 'outline' | 'secondary' }> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PARTIAL: { label: 'Parcial', variant: 'secondary' },
  PAID: { label: 'Pagada', variant: 'success' },
};

export function DebtDetailCard({ debt }: DebtDetailCardProps) {
  const paid = debt.amount - debt.remainingAmount;
  const progressPercent = debt.amount > 0 ? Math.round((paid / debt.amount) * 100) : 0;
  const config = statusConfig[debt.status] ?? statusConfig.PENDING;

  return (
    <div className="border-2 border-foreground bg-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{debt.description}</h3>
          <p className="text-sm text-muted-foreground">Creada el {formatDate(debt.date)}</p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Monto original</p>
          <p className="text-lg font-bold">{formatCLP(debt.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pagado</p>
          <p className="text-lg font-bold text-green-600">{formatCLP(paid)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pendiente</p>
          <p className="text-lg font-bold text-red-600">{formatCLP(debt.remainingAmount)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Payment history */}
      {debt.payments && debt.payments.length > 0 && (
        <div>
          <h4 className="font-bold mb-2">Historial de pagos</h4>
          <div className="space-y-2">
            {debt.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 bg-muted rounded-md"
              >
                <span className="text-sm">{formatDate(payment.date)}</span>
                <span className="font-medium text-green-600">{formatCLP(payment.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
