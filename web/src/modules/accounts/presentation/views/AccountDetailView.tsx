'use client';

/**
 * Vista de detalle de una cuenta
 *
 * Muestra la informacion completa de la cuenta
 * con su resumen financiero y subcuentas
 */

import React from 'react';
import { AccountDetailCard } from '../components/AccountDetailCard';
import { useAccountDetail } from '../hooks/useAccountDetail';

interface AccountDetailViewProps {
  accountId: number;
  onBack?: () => void;
}

const backButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #1e293b',
  color: '#94a3b8',
  padding: '8px 16px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};

export function AccountDetailView({ accountId, onBack }: AccountDetailViewProps) {
  const { accountDetail, isLoading, error } = useAccountDetail(accountId);

  const handleGoBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    window.location.href = '/dashboard/accounts';
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
        <p style={{ margin: 0 }}>Cargando detalle de cuenta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button onClick={handleGoBack} style={backButtonStyle}>
            Volver a Cuentas
          </button>
        </div>
        <div
          style={{
            padding: 16,
            border: '1px solid #ef4444',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: 12,
          }}
        >
          <p style={{ fontWeight: 700, color: '#ef4444', margin: 0, marginBottom: 4 }}>Error:</p>
          <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!accountDetail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button onClick={handleGoBack} style={backButtonStyle}>
            Volver a Cuentas
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <p style={{ margin: 0 }}>No se encontro la cuenta</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={handleGoBack} style={backButtonStyle}>
          Volver a Cuentas
        </button>
      </div>

      <AccountDetailCard detail={accountDetail} />
    </div>
  );
}
