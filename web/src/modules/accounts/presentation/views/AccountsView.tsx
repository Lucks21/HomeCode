'use client';

/**
 * Vista principal del modulo Accounts
 *
 * Integra todos los componentes:
 * - Header con boton crear
 * - Barra de filtros (busqueda, tipo, archivadas)
 * - Arbol de cuentas
 * - Modal crear/editar
 */

import { useState, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { Button } from '@/shared/presentation/components/ui/Button';
import { Input } from '@/shared/presentation/components/ui/Input';
import { Checkbox } from '@/shared/presentation/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/Select';
import { useToast } from '@/shared/presentation/hooks/useToast';
import { ToastNotifications } from '@/shared/presentation/components/ui/ToastNotifications';

import { AccountsTree } from '../components/AccountsTree';
import { AccountFormModal } from '../components/AccountFormModal';
import { useAccounts } from '../hooks/useAccounts';
import type { Account, AccountFilters } from '../../domain/types';
import type { AccountFormData } from '../../application/validations/account.schema';

const defaultFilters: AccountFilters = {
  search: '',
  type: 'TODOS',
  includeArchived: false,
};

const typeFilterOptions = [
  { value: 'TODOS', label: 'Todos los tipos' },
  { value: 'MAIN', label: 'Principal' },
  { value: 'DEBT', label: 'Deuda' },
  { value: 'INSTALLMENT', label: 'Cuota' },
];

export function AccountsView() {
  const [filters, setFilters] = useState<AccountFilters>(defaultFilters);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const {
    accounts,
    isLoading,
    error: accountsError,
    fetchAccounts,
    createAccount,
    updateAccount,
    archiveAccount,
  } = useAccounts();

  const { toasts, removeToast, success, error: showError } = useToast();

  // Filtrar cuentas
  const filteredAccounts = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    return accounts.filter((account) => {
      const matchesSearch =
        filters.search === '' ||
        account.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        filters.type === 'TODOS' || account.type === filters.type;

      const matchesArchived = filters.includeArchived || !account.archived;

      return matchesSearch && matchesType && matchesArchived;
    });
  }, [accounts, filters]);

  // Construir estructura de arbol
  const treeAccounts = useMemo(() => {
    const rootAccounts = filteredAccounts.filter((a) => !a.parentId);
    const childrenMap = new Map<number, Account[]>();

    filteredAccounts.forEach((account) => {
      if (account.parentId) {
        const existing = childrenMap.get(account.parentId) || [];
        existing.push(account);
        childrenMap.set(account.parentId, existing);
      }
    });

    return rootAccounts.map((root) => ({
      ...root,
      children: childrenMap.get(root.id) || [],
    }));
  }, [filteredAccounts]);

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setIsFormModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsFormModalOpen(true);
  };

  const handleArchiveAccount = async (account: Account) => {
    try {
      await archiveAccount(account.id);
      success('Cuenta archivada exitosamente');
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al archivar cuenta');
      showError(errorMessage);
    }
  };

  const handleSelectAccount = (account: Account) => {
    window.location.href = `/dashboard/accounts/${account.id}`;
  };

  const handleFormSubmit = async (data: AccountFormData) => {
    try {
      if (selectedAccount) {
        await updateAccount(selectedAccount.id, data);
        success('Cuenta actualizada exitosamente');
      } else {
        await createAccount(data);
        success('Cuenta creada exitosamente');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Error al guardar cuenta');
      showError(errorMessage);
    }
  };

  const handleIncludeArchivedChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, includeArchived: checked }));
    fetchAccounts(checked);
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastNotifications toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cuentas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus cuentas principales, deudas y cuotas
          </p>
        </div>
        <Button onClick={handleCreateAccount}>
          + Nueva Cuenta
        </Button>
      </div>

      {/* Error */}
      {accountsError && (
        <div className="mb-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{accountsError}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border-2 border-foreground rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar cuentas..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="w-[200px]">
          <Select
            value={filters.type}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                type: val as AccountFilters['type'],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {typeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.includeArchived}
            onCheckedChange={handleIncludeArchivedChange}
          />
          <span className="text-sm">Incluir archivadas</span>
        </label>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Cargando cuentas...</p>
        </div>
      )}

      {/* Arbol de cuentas */}
      {!isLoading && (
        <AccountsTree
          accounts={treeAccounts}
          onEdit={handleEditAccount}
          onArchive={handleArchiveAccount}
          onSelect={handleSelectAccount}
        />
      )}

      {/* Modal Crear/Editar Cuenta */}
      <AccountFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        account={selectedAccount}
        accounts={accounts}
        isLoading={isLoading}
      />
    </>
  );
}
