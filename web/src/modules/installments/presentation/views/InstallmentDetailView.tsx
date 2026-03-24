'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { Button } from '@/shared/presentation/components/ui/Button';
import { InstallmentDetailCard } from '../components/InstallmentDetailCard';
import { InstallmentPaymentsList } from '../components/InstallmentPaymentsList';
import { InstallmentPayModal } from '../components/InstallmentPayModal';
import { useInstallmentDetail } from '../hooks/useInstallmentDetail';
import { installmentsRepository } from '../../infrastructure/repositories/InstallmentsHttpRepository';

interface InstallmentDetailViewProps {
  installmentId: number;
  onBack?: () => void;
}

export function InstallmentDetailView({ installmentId, onBack }: InstallmentDetailViewProps) {
  const { installment, isLoading, error, refetch } = useInstallmentDetail(installmentId);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const handlePaySubmit = async (count: number) => {
    setPayLoading(true);
    try {
      await installmentsRepository.payInstallments(installmentId, count);
      setIsPayModalOpen(false);
      refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al pagar cuotas');
      console.error(errorMessage);
    } finally {
      setPayLoading(false);
    }
  };

  if (isLoading && !installment) {
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

  if (!installment) {
    return <div className="p-8 text-center text-muted-foreground">Plan de cuotas no encontrado</div>;
  }

  const paidCount = installment.paidCount ?? 0;
  const isPaidOff = paidCount >= installment.totalInstallments;

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        )}
        <h1 className="text-2xl font-bold">Detalle de Cuotas</h1>
      </div>

      <InstallmentDetailCard installment={installment} />

      {!isPaidOff && (
        <div className="mt-4">
          <Button onClick={() => setIsPayModalOpen(true)}>
            Pagar Cuotas
          </Button>
        </div>
      )}

      {installment.payments && installment.payments.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Detalle de Cuotas</h2>
          <InstallmentPaymentsList payments={installment.payments} />
        </div>
      )}

      <InstallmentPayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onSubmit={handlePaySubmit}
        installment={installment}
        isLoading={payLoading}
      />
    </>
  );
}
