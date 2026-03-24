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
            <div style={{ padding: 12, background: '#0b0f19', borderRadius: 8, border: '1px solid #1e293b' }}>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>{installment.description}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0, marginTop: 4 }}>
                Cuotas pendientes: {pendingCount} de {installment.totalInstallments}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>
              Cuantas cuotas desea pagar?
            </label>
            <Input
              type="number"
              min={1}
              max={pendingCount}
              value={count}
              onChange={(e) => setCount(Number((e.target as HTMLInputElement).value))}
            />
            <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
              Mínimo 1, máximo {pendingCount}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: '1px solid #1e293b' }}>
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
