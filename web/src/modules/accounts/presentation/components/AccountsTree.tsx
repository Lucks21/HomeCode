'use client';

/**
 * Componente para renderizar cuentas en estructura de arbol
 */

import React from 'react';
import { Badge } from '@/shared/presentation/components/ui/Badge';
import { Button } from '@/shared/presentation/components/ui/Button';
import type { Account } from '../../domain/types';

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  MAIN: { bg: '#dbeafe', text: '#1e40af', label: 'Principal' },
  DEBT: { bg: '#fef3c7', text: '#92400e', label: 'Deuda' },
  INSTALLMENT: { bg: '#ede9fe', text: '#5b21b6', label: 'Cuota' },
};

interface AccountsTreeProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
  onSelect: (account: Account) => void;
}

function AccountNode({
  account,
  level,
  onEdit,
  onArchive,
  onSelect,
}: {
  account: Account;
  level: number;
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
  onSelect: (account: Account) => void;
}) {
  const typeInfo = typeColors[account.type] || typeColors.MAIN;

  return (
    <>
      <div
        className="flex items-center justify-between py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors"
        style={{ paddingLeft: `${16 + level * 24}px` }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {level > 0 && (
            <span className="text-muted-foreground text-sm">{'--'}</span>
          )}
          <button
            type="button"
            onClick={() => onSelect(account)}
            className="font-medium text-sm hover:underline cursor-pointer truncate text-left"
          >
            {account.name}
          </button>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
          >
            {typeInfo.label}
          </span>
          {account.archived && (
            <Badge variant="secondary" className="text-xs">
              Archivada
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(account)}
          >
            Ver
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(account)}
          >
            Editar
          </Button>
          {!account.archived && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(account)}
            >
              Archivar
            </Button>
          )}
        </div>
      </div>

      {account.children &&
        account.children.map((child) => (
          <AccountNode
            key={child.id}
            account={child}
            level={level + 1}
            onEdit={onEdit}
            onArchive={onArchive}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

export function AccountsTree({ accounts, onEdit, onArchive, onSelect }: AccountsTreeProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No se encontraron cuentas</p>
        <p className="text-sm mt-1">Crea una nueva cuenta para comenzar</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground rounded-lg overflow-hidden">
      <div className="flex items-center justify-between py-2 px-4 bg-muted/50 border-b-2 border-foreground">
        <span className="text-sm font-bold">Nombre</span>
        <span className="text-sm font-bold">Acciones</span>
      </div>
      {accounts.map((account) => (
        <AccountNode
          key={account.id}
          account={account}
          level={0}
          onEdit={onEdit}
          onArchive={onArchive}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
