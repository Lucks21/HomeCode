'use client';

import { useState, useEffect } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { ModulePageHeader } from '@/shared/presentation/components/ModulePageHeader';
import { Button } from '@/shared/presentation/components/ui/Button';
import { InstallmentsTable } from '../components/InstallmentsTable';
import { InstallmentFormModal } from '../components/InstallmentFormModal';
import { InstallmentPayModal } from '../components/InstallmentPayModal';
import { InstallmentDetailCard } from '../components/InstallmentDetailCard';
import { InstallmentPaymentsList } from '../components/InstallmentPaymentsList';
import { useInstallments } from '../hooks/useInstallments';
import { useInstallmentDetail } from '../hooks/useInstallmentDetail';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import type { Account } from '@/modules/accounts/domain/types';
import type { Installment } from '../../domain/types';
import type { InstallmentFormData } from '../../application/validations/installment.schema';

export function InstallmentsView() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [detailInstallmentId, setDetailInstallmentId] = useState<number | null>(null);

  const {
    installments,
    isLoading,
    error,
    fetchInstallments,
    createInstallment,
    payInstallments,
    archiveInstallment,
  } = useInstallments();

  const { installment: installmentDetail, refetch: refetchDetail } =
    useInstallmentDetail(detailInstallmentId);

  // Fetch accounts for selectors
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await accountsRepository.getAll();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    loadAccounts();
  }, []);

  const handleCreate = () => setIsFormModalOpen(true);

  const handleViewDetail = (installment: Installment) => {
    setDetailInstallmentId(installment.id);
  };

  const handleCloseDetail = () => {
    setDetailInstallmentId(null);
    fetchInstallments();
  };

  const handlePay = (installment: Installment) => {
    setSelectedInstallment(installment);
    setIsPayModalOpen(true);
  };

  const handleArchive = async (installment: Installment) => {
    try {
      await archiveInstallment(installment.id);
    } catch (err) {
      console.error('Error al archivar:', err);
    }
  };

  const handleFormSubmit = async (data: InstallmentFormData) => {
    try {
      await createInstallment(data);
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al crear plan de cuotas');
      console.error(errorMessage);
    }
  };

  const handlePaySubmit = async (count: number) => {
    if (!selectedInstallment) return;
    try {
      await payInstallments(selectedInstallment.id, count);
      setIsPayModalOpen(false);
      if (detailInstallmentId === selectedInstallment.id) {
        refetchDetail();
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al pagar cuotas');
      console.error(errorMessage);
    }
  };

  // If viewing detail, show detail view inline
  if (detailInstallmentId && installmentDetail) {
    const paidCount = installmentDetail.paidCount ?? 0;
    const isPaidOff = paidCount >= installmentDetail.totalInstallments;

    return (
      <>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={handleCloseDetail}>
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Detalle de Cuotas</h1>
        </div>

        <InstallmentDetailCard installment={installmentDetail} />

        {!isPaidOff && (
          <div className="mt-4">
            <Button onClick={() => handlePay(installmentDetail)}>
              Pagar Cuotas
            </Button>
          </div>
        )}

        {installmentDetail.payments && installmentDetail.payments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Detalle de Cuotas</h2>
            <InstallmentPaymentsList payments={installmentDetail.payments} />
          </div>
        )}

        <InstallmentPayModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          onSubmit={handlePaySubmit}
          installment={selectedInstallment}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <ModulePageHeader
        title="Cuotas"
        description="Gestiona tus compras en cuotas y pagos programados"
        actions={
          <Button onClick={handleCreate}>
            + Nuevo Plan de Cuotas
          </Button>
        }
      />

      {error && (
        <div className="mt-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        <InstallmentsTable
          installments={installments}
          onViewDetail={handleViewDetail}
          onPay={handlePay}
          onArchive={handleArchive}
        />
      </div>

      <InstallmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        accounts={accounts}
        isLoading={isLoading}
      />

      <InstallmentPayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onSubmit={handlePaySubmit}
        installment={selectedInstallment}
        isLoading={isLoading}
      />
    </>
  );
}
