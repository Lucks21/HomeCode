'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { Button } from '@/shared/presentation/components/ui/Button';
import { DebtDetailCard } from '../components/DebtDetailCard';
import { DebtPaymentModal } from '../components/DebtPaymentModal';
import { useDebtDetail } from '../hooks/useDebtDetail';
import { debtsRepository } from '../../infrastructure/repositories/DebtsHttpRepository';
import type { DebtPaymentFormData } from '../../application/validations/debtPayment.schema';

interface DebtDetailViewProps {
  debtId: number;
  onBack?: () => void;
}

export function DebtDetailView({ debtId, onBack }: DebtDetailViewProps) {
  const { debt, isLoading, error, refetch } = useDebtDetail(debtId);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePaymentSubmit = async (data: DebtPaymentFormData) => {
    setPaymentLoading(true);
    try {
      await debtsRepository.registerPayment(debtId, data);
      setIsPaymentModalOpen(false);
      refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al registrar pago');
      console.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading && !debt) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="p-4 border-2 border-destructive bg-destructive/10 text-destructive">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!debt) {
    return <div className="p-8 text-center text-muted-foreground">Deuda no encontrada</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        )}
        <h1 className="text-2xl font-bold">Detalle de Deuda</h1>
      </div>

      <DebtDetailCard debt={debt} />

      {debt.status !== 'PAID' && (
        <div className="mt-4">
          <Button onClick={() => setIsPaymentModalOpen(true)}>
            Registrar Pago
          </Button>
        </div>
      )}

      <DebtPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        debt={debt}
        isLoading={paymentLoading}
      />
    </>
  );
}
