'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/shared/utils';
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
    return (
      <div
        style={{
          padding: 32,
          textAlign: 'center',
          color: '#64748b',
          fontSize: 14,
        }}
      >
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: 16,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12,
          color: '#ef4444',
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 4 }}>Error:</p>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (!debt) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: 'center',
          color: '#64748b',
          fontSize: 14,
        }}
      >
        Deuda no encontrada
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#94a3b8',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 16,
              display: 'block',
            }}
          >
            ← Volver
          </button>
        )}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Detalle de Deuda
        </h1>
      </div>

      <DebtDetailCard debt={debt} />

      {debt.status !== 'PAID' && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            style={{
              border: '1px solid #10b981',
              color: '#10b981',
              background: 'transparent',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Registrar Pago
          </button>
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
