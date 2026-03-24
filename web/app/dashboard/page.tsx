'use client';

import { useState, useEffect } from 'react';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import { CurrencyDisplay } from '@/shared/presentation/components/CurrencyDisplay';

export default function DashboardPage() {
  const [summary, setSummary] = useState<{ income: number; expenses: number; balance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    accountsRepository
      .getMonthlySummary(now.getFullYear(), now.getMonth() + 1)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '8px' }}>Ingresos del Mes</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>
            {isLoading ? '...' : <CurrencyDisplay amount={summary?.income ?? 0} />}
          </p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '8px' }}>Gastos del Mes</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>
            {isLoading ? '...' : <CurrencyDisplay amount={summary?.expenses ?? 0} />}
          </p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '8px' }}>Balance del Mes</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: (summary?.balance ?? 0) >= 0 ? '#16a34a' : '#dc2626' }}>
            {isLoading ? '...' : <CurrencyDisplay amount={summary?.balance ?? 0} />}
          </p>
        </div>
      </div>
    </div>
  );
}
