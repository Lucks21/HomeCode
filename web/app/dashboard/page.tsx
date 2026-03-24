'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar } from 'lucide-react';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import { formatCLP } from '@/shared/presentation/components/CurrencyDisplay';
import { useAuth } from '@/modules/auth/presentation/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
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

  const cardBase: React.CSSProperties = {
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Bienvenido, {user?.name?.split(' ')[0] || 'Usuario'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
          Aqui tienes un resumen de tu actividad financiera
        </p>
      </div>

      {/* Top Cards: Ingresos, Gastos, Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {/* Ingresos */}
        <div style={{ ...cardBase, background: 'linear-gradient(135deg, #065f46, #047857)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#a7f3d0', fontSize: '0.85rem', fontWeight: 500 }}>Ingresos del Mes</span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#a7f3d0" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
            {isLoading ? '...' : formatCLP(summary?.income ?? 0)}
          </span>
        </div>

        {/* Gastos */}
        <div style={{ ...cardBase, background: 'linear-gradient(135deg, #7f1d1d, #991b1b)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 500 }}>Gastos del Mes</span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} color="#fca5a5" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
            {isLoading ? '...' : formatCLP(summary?.expenses ?? 0)}
          </span>
        </div>

        {/* Balance */}
        <div style={{ ...cardBase, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#93c5fd', fontSize: '0.85rem', fontWeight: 500 }}>Balance del Mes</span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="#93c5fd" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
            {isLoading ? '...' : formatCLP(summary?.balance ?? 0)}
          </span>
        </div>
      </div>

      {/* Secondary Cards: Deudas por Cobrar, Cuotas Pendientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ ...cardBase, background: '#111827', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Deudas por Cobrar</span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#fbbf24" />
            </div>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
            Ver deudas
          </span>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Gestiona las deudas que te deben</p>
        </div>

        <div style={{ ...cardBase, background: '#111827', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Cuotas Pendientes</span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} color="#8b5cf6" />
            </div>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
            Ver cuotas
          </span>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Controla tus planes de cuotas</p>
        </div>
      </div>
    </div>
  );
}
