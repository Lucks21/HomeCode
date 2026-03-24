'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Wallet, FileText, LayoutDashboard } from 'lucide-react';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import { formatCLP } from '@/shared/presentation/components/CurrencyDisplay';
import { useAuth } from '@/modules/auth/presentation/hooks/useAuth';
import type { Account } from '@/modules/accounts/domain/types';

type AccountSummary = { income: number; expenses: number; balance: number };

const typeIconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  MAIN:        { icon: Wallet,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  DEBT:        { icon: FileText, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  INSTALLMENT: { icon: Calendar, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedAccounts, setPinnedAccounts] = useState<{ account: Account; summary: AccountSummary }[]>([]);

  useEffect(() => {
    const now = new Date();
    accountsRepository
      .getMonthlySummary(now.getFullYear(), now.getMonth() + 1)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const loadPinned = async () => {
      try {
        const all = await accountsRepository.getAll();
        const pinned = all.filter((a) => a.showInDashboard && !a.archived);
        const withSummaries = await Promise.all(
          pinned.map(async (account) => ({
            account,
            summary: await accountsRepository.getSummary(account.id),
          })),
        );
        setPinnedAccounts(withSummaries);
      } catch (err) {
        console.error('Error loading pinned accounts:', err);
      }
    };
    loadPinned();
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

      {/* Pinned Account Balances */}
      {pinnedAccounts.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <LayoutDashboard size={18} color="#10b981" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
              Mis Cuentas
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {pinnedAccounts.map(({ account, summary: s }) => {
              const typeConf = typeIconMap[account.type] || typeIconMap.MAIN;
              const IconComp = typeConf.icon;
              const balanceColor = s.balance > 0 ? '#10b981' : s.balance < 0 ? '#ef4444' : '#94a3b8';
              return (
                <div
                  key={account.id}
                  style={{
                    ...cardBase,
                    background: '#111827',
                    border: '1px solid #1e293b',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: typeConf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp size={16} color={typeConf.color} />
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {account.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: balanceColor }}>
                    {formatCLP(s.balance)}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
                    <span>+{formatCLP(s.income)}</span>
                    <span>-{formatCLP(s.expenses)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
