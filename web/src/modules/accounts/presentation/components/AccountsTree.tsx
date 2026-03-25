'use client';

/**
 * Componente para renderizar cuentas en estructura de arbol con tarjetas dark
 */

import React, { useState } from 'react';
import { Wallet, FileText, Calendar, ChevronRight, Pencil, Archive, ArchiveRestore, LayoutDashboard } from 'lucide-react';
import type { Account } from '../../domain/types';

const typeConfig: Record<
  string,
  {
    color: string;
    bgAlpha: string;
    label: string;
    icon: React.ElementType;
  }
> = {
  MAIN: {
    color: '#10b981',
    bgAlpha: 'rgba(16,185,129,0.15)',
    label: 'General',
    icon: Wallet,
  },
  DEBT: {
    color: '#fbbf24',
    bgAlpha: 'rgba(251,191,36,0.15)',
    label: 'Deuda',
    icon: FileText,
  },
  INSTALLMENT: {
    color: '#8b5cf6',
    bgAlpha: 'rgba(139,92,246,0.15)',
    label: 'Cuotas',
    icon: Calendar,
  },
};

interface AccountsTreeProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
  onUnarchive: (account: Account) => void;
  onSelect: (account: Account) => void;
  onToggleDashboard: (account: Account, show: boolean) => void;
}

function AccountCard({
  account,
  level,
  onEdit,
  onArchive,
  onUnarchive,
  onSelect,
  onToggleDashboard,
}: {
  account: Account;
  level: number;
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
  onUnarchive: (account: Account) => void;
  onSelect: (account: Account) => void;
  onToggleDashboard: (account: Account, show: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const config = typeConfig[account.type] || typeConfig.MAIN;
  const IconComponent = config.icon;

  return (
    <>
      <div
        style={{
          marginLeft: level > 0 ? 32 * level : 0,
          marginBottom: 8,
          background: '#111827',
          border: `1px solid ${isHovered ? '#2d3748' : '#1e293b'}`,
          borderRadius: 12,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          transition: 'border-color 0.2s, filter 0.2s',
          filter: isHovered ? 'brightness(1.08)' : 'brightness(1)',
          opacity: account.archived ? 0.6 : 1,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(account)}
      >
        {/* Icon circle */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: config.bgAlpha,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconComponent size={20} style={{ color: config.color }} />
        </div>

        {/* Account name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              color: '#f1f5f9',
              fontWeight: 600,
              fontSize: 15,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {account.name}
          </span>
          {account.archived && (
            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                marginTop: 2,
                display: 'block',
              }}
            >
              Archivada
            </span>
          )}
        </div>

        {/* Type badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: config.bgAlpha,
            color: config.color,
            flexShrink: 0,
          }}
        >
          {config.label}
        </span>

        {/* Dashboard toggle — always visible, green when pinned */}
        {!account.archived && (
          <button
            type="button"
            title={account.showInDashboard ? 'Quitar del dashboard' : 'Mostrar en dashboard'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDashboard(account, !account.showInDashboard);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: account.showInDashboard
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(148, 163, 184, 0.1)',
              color: account.showInDashboard ? '#10b981' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!account.showInDashboard) {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.color = '#10b981';
              } else {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#ef4444';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = account.showInDashboard
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(148, 163, 184, 0.1)';
              e.currentTarget.style.color = account.showInDashboard ? '#10b981' : '#64748b';
            }}
          >
            <LayoutDashboard size={15} />
          </button>
        )}

        {/* Action buttons (visible on hover) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.15s',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            title="Editar"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(account);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'rgba(148, 163, 184, 0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
              e.currentTarget.style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <Pencil size={15} />
          </button>
          {!account.archived && (
            <button
              type="button"
              title="Archivar"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(account);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: 'rgba(148, 163, 184, 0.1)',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)';
                e.currentTarget.style.color = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <Archive size={15} />
            </button>
          )}
          {account.archived && (
            <button
              type="button"
              title="Desarchivar"
              onClick={(e) => {
                e.stopPropagation();
                onUnarchive(account);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: 'rgba(148, 163, 184, 0.1)',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <ArchiveRestore size={15} />
            </button>
          )}
        </div>

        {/* Chevron right */}
        <ChevronRight
          size={20}
          style={{ color: '#475569', flexShrink: 0 }}
        />
      </div>

      {/* Render children */}
      {account.children &&
        account.children.map((child) => (
          <AccountCard
            key={child.id}
            account={child}
            level={level + 1}
            onEdit={onEdit}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onSelect={onSelect}
            onToggleDashboard={onToggleDashboard}
          />
        ))}
    </>
  );
}

export function AccountsTree({ accounts, onEdit, onArchive, onUnarchive, onSelect, onToggleDashboard }: AccountsTreeProps) {
  if (accounts.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 0',
          color: '#94a3b8',
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          No se encontraron cuentas
        </p>
        <p style={{ fontSize: 14, marginTop: 4, color: '#64748b' }}>
          Crea una nueva cuenta para comenzar
        </p>
      </div>
    );
  }

  return (
    <div>
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          level={0}
          onEdit={onEdit}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onSelect={onSelect}
          onToggleDashboard={onToggleDashboard}
        />
      ))}
    </div>
  );
}
