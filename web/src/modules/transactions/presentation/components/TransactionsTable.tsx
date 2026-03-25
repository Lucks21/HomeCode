'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Archive, ArchiveRestore } from 'lucide-react';
import type { Transaction } from '../../domain/types';
import type { Account } from '@/modules/accounts/domain/types';

interface TransactionsTableProps {
  transactions: Transaction[];
  accounts: Account[];
  onEdit: (transaction: Transaction) => void;
  onArchive: (transaction: Transaction) => void;
  onUnarchive?: (transaction: Transaction) => void;
}

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL');
};

const emptyContainerStyle: React.CSSProperties = {
  background: '#111827',
  border: '1px solid #1e293b',
  borderRadius: '12px',
  padding: '48px',
  textAlign: 'center',
};

const emptyIconStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'rgba(100, 116, 139, 0.1)',
  margin: '0 auto 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
  fontSize: '1.5rem',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 0',
  borderBottom: '1px solid #1e293b',
  position: 'relative',
};

const iconCircleBase: React.CSSProperties = {
  width: '44px',
  height: '44px',
  minWidth: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '14px',
};

const descriptionStyle: React.CSSProperties = {
  color: '#f1f5f9',
  fontWeight: 500,
  fontSize: '0.95rem',
  lineHeight: 1.3,
};

const subTextStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '0.8rem',
  marginTop: '2px',
};

const actionButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
  transition: 'background 0.15s, color 0.15s',
};

function TransactionItem({
  transaction,
  accountName,
  onEdit,
  onArchive,
  onUnarchive,
}: {
  transaction: Transaction;
  accountName: string;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isExpense = transaction.type === 'EXPENSE';
  const isArchived = transaction.archived;

  const iconCircleStyle: React.CSSProperties = {
    ...iconCircleBase,
    background: isExpense ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    opacity: isArchived ? 0.5 : 1,
  };

  const amountStyle: React.CSSProperties = {
    color: isExpense ? '#ef4444' : '#10b981',
    fontWeight: 700,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    opacity: isArchived ? 0.5 : 1,
  };

  const prefix = isExpense ? '- ' : '+ ';

  return (
    <div
      style={{ ...itemStyle, opacity: isArchived ? 0.7 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div style={iconCircleStyle}>
        {isExpense ? (
          <ArrowDownLeft size={20} color="#ef4444" />
        ) : (
          <ArrowUpRight size={20} color="#10b981" />
        )}
      </div>

      {/* Center: description + account/date */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...descriptionStyle, textDecoration: isArchived ? 'line-through' : 'none' }}>
          {transaction.description}
        </div>
        <div style={subTextStyle}>
          {accountName} &middot; {formatDate(transaction.date)}
          {isArchived && <span style={{ marginLeft: 6, color: '#f59e0b', fontSize: '0.75rem' }}>Archivado</span>}
        </div>
      </div>

      {/* Right: amount + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={amountStyle}>
          {prefix}{formatCLP(transaction.amount)}
        </span>

        {/* Action buttons (visible on hover) */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.15s',
          }}
        >
          {isArchived ? (
            onUnarchive && (
              <button
                style={actionButtonStyle}
                onClick={onUnarchive}
                title="Desarchivar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1e293b';
                  (e.currentTarget as HTMLButtonElement).style.color = '#10b981';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                }}
              >
                <ArchiveRestore size={16} />
              </button>
            )
          ) : (
            <>
              <button
                style={actionButtonStyle}
                onClick={onEdit}
                title="Editar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1e293b';
                  (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                style={actionButtonStyle}
                onClick={onArchive}
                title="Archivar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1e293b';
                  (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                }}
              >
                <Archive size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function TransactionsTable({ transactions, accounts, onEdit, onArchive, onUnarchive }: TransactionsTableProps) {
  const accountMap = new Map(accounts.map((a) => [a.id, a.name]));

  if (transactions.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <div style={emptyIconStyle}>
          <span>$</span>
        </div>
        <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
          Sin resultados
        </h3>
        <p style={{ color: '#64748b' }}>
          No se encontraron transacciones con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          accountName={accountMap.get(transaction.accountId) ?? 'Cuenta desconocida'}
          onEdit={() => onEdit(transaction)}
          onArchive={() => onArchive(transaction)}
          onUnarchive={onUnarchive ? () => onUnarchive(transaction) : undefined}
        />
      ))}
    </div>
  );
}
