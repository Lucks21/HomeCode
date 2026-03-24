'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/presentation/components/ui/Dialog';
import { Input } from '@/shared/presentation/components/ui/Input';
import { Button } from '@/shared/presentation/components/ui/Button';
import type { Installment } from '../../domain/types';

interface InstallmentPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (count: number) => Promise<void>;
  installment: Installment | null;
  isLoading?: boolean;
}

export function InstallmentPayModal({
  isOpen,
  onClose,
  onSubmit,
  installment,
  isLoading = false,
}: InstallmentPayModalProps) {
  const [count, setCount] = useState(1);

  const pendingCount = installment?.pendingCount ??
    (installment ? installment.totalInstallments - (installment.paidCount ?? 0) : 0);

  const handleSubmit = async () => {
    if (count < 1 || count > pendingCount) return;
    await onSubmit(count);
    setCount(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-foreground p-0 gap-0">
        <DialogHeader className="p-6 border-b-2 border-foreground">
          <DialogTitle className="text-xl font-bold">Pagar Cuotas</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {installment && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">{installment.description}</p>
              <p className="text-sm font-bold">
                Cuotas pendientes: {pendingCount} de {installment.totalInstallments}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cuantas cuotas desea pagar?
            </label>
            <Input
              type="number"
              min={1}
              max={pendingCount}
              value={count}
              onChange={(e) => setCount(Number((e.target as HTMLInputElement).value))}
            />
            <p className="text-sm text-muted-foreground">
              Mínimo 1, máximo {pendingCount}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || count < 1 || count > pendingCount}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pagando...
                </>
              ) : (
                `Pagar ${count} cuota${count !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
