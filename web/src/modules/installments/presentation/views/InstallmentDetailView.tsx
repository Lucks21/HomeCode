'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { InstallmentPayModal } from '../components/InstallmentPayModal';
import { useInstallmentDetail } from '../hooks/useInstallmentDetail';
import { installmentsRepository } from '../../infrastructure/repositories/InstallmentsHttpRepository';

interface InstallmentDetailViewProps {
  installmentId: number;
  onBack?: () => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

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
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 16,
        border: '1px solid #ef4444',
        borderRadius: 12,
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
      }}>
        <p style={{ fontWeight: 700, margin: 0, marginBottom: 4 }}>Error:</p>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (!installment) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
        Plan de cuotas no encontrado
      </div>
    );
  }

  const paidCount = installment.paidCount ?? 0;
  const total = installment.totalInstallments;
  const percent = installment.progressPercentage ??
    (total > 0 ? Math.round((paidCount / total) * 100) : 0);
  const isPaidOff = paidCount >= total;
  const remaining = installment.totalAmount - (paidCount * installment.installmentValue);

  return (
    <>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {onBack && (
          <button
            onClick={onBack}
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
        )}
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
          {installment.description}
        </h3>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20, marginTop: 0 }}>
          Inicio: {formatDate(installment.startDate)}
        </p>

        {/* Info row */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Monto Total</p>
            <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 18, margin: 0 }}>
              {formatCLP(installment.totalAmount)}
            </p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Valor Cuota</p>
            <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 18, margin: 0 }}>
              {formatCLP(installment.installmentValue)}
            </p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Monto Restante</p>
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
            onClick={() => setIsPayModalOpen(true)}
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
      {installment.payments && installment.payments.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>
            Detalle de Cuotas
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}>
            {installment.payments.map((payment) => (
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
                <p style={{ color: '#64748b', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                  {payment.paid && payment.paidDate
                    ? `Pagada: ${formatDate(payment.paidDate)}`
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
        installment={installment}
        isLoading={payLoading}
      />
    </>
  );
}
