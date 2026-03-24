'use client';

import { useState, useEffect } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { InstallmentsTable } from '../components/InstallmentsTable';
import { InstallmentFormModal } from '../components/InstallmentFormModal';
import { InstallmentPayModal } from '../components/InstallmentPayModal';
import { useInstallments } from '../hooks/useInstallments';
import { useInstallmentDetail } from '../hooks/useInstallmentDetail';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import type { Account } from '@/modules/accounts/domain/types';
import type { Installment } from '../../domain/types';
import type { InstallmentFormData } from '../../application/validations/installment.schema';

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

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
    const total = installmentDetail.totalInstallments;
    const percent = installmentDetail.progressPercentage ??
      (total > 0 ? Math.round((paidCount / total) * 100) : 0);
    const isPaidOff = paidCount >= total;
    const remaining = installmentDetail.totalAmount - (paidCount * installmentDetail.installmentValue);

    return (
      <>
        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={handleCloseDetail}
            style={{
              border: '1px solid #1e293b',
              color: '#94a3b8',
              background: 'transparent',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            &larr; Volver
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            Detalle de Cuotas
          </h1>
        </div>

        {/* Detail card */}
        <div style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, color: '#f1f5f9', margin: 0, marginBottom: 4 }}>
            {installmentDetail.description}
          </h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
            Inicio: {new Date(installmentDetail.startDate).toLocaleDateString('es-CL')}
          </p>

          <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>Monto Total</p>
              <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 18, margin: 0 }}>
                {formatCLP(installmentDetail.totalAmount)}
              </p>
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>Valor Cuota</p>
              <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 18, margin: 0 }}>
                {formatCLP(installmentDetail.installmentValue)}
              </p>
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>Monto Restante</p>
              <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 18, margin: 0 }}>
                {formatCLP(remaining > 0 ? remaining : 0)}
              </p>
            </div>
          </div>

          {/* Large progress bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{
              height: 12,
              borderRadius: 6,
              background: '#2d3748',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${percent}%`,
                background: '#10b981',
                borderRadius: 6,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>
              {paidCount} de {total} cuotas pagadas
            </span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{percent}%</span>
          </div>
        </div>

        {/* Pay button */}
        {!isPaidOff && (
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => handlePay(installmentDetail)}
              style={{
                border: '1px solid #10b981',
                color: '#10b981',
                background: 'transparent',
                borderRadius: 8,
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Pagar Cuotas
            </button>
          </div>
        )}

        {/* Payments grid */}
        {installmentDetail.payments && installmentDetail.payments.length > 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>
              Detalle de Cuotas
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}>
              {installmentDetail.payments.map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    background: '#111827',
                    border: `1px solid ${payment.paid ? '#10b981' : '#1e293b'}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
                      Cuota #{payment.installmentNumber}
                    </span>
                    {payment.paid ? (
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#10b981',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        &#10003;
                      </span>
                    ) : (
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#2d3748',
                        display: 'inline-block',
                      }} />
                    )}
                  </div>
                  <p style={{ color: '#f1f5f9', fontWeight: 500, fontSize: 15, margin: 0 }}>
                    {formatCLP(payment.amount)}
                  </p>
                  <p style={{ color: '#64748b', fontSize: 12, marginTop: 4, margin: 0 }}>
                    {payment.paid && payment.paidDate
                      ? `Pagada: ${new Date(payment.paidDate).toLocaleDateString('es-CL')}`
                      : 'Pendiente'}
                  </p>
                </div>
              ))}
            </div>
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
      {/* Page header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Cuotas</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Gestiona tus compras en cuotas y pagos programados
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          + Nuevo Plan
        </button>
      </div>

      {error && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          border: '1px solid #ef4444',
          borderRadius: 12,
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
        }}>
          <p style={{ fontWeight: 700, margin: 0, marginBottom: 4 }}>Error:</p>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <InstallmentsTable
        installments={installments}
        onViewDetail={handleViewDetail}
        onPay={handlePay}
        onArchive={handleArchive}
      />

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
