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
import { Plus, Search } from 'lucide-react';
import { getErrorMessage } from '@/shared/utils';
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#f1f5f9',
              margin: 0,
            }}
          >
            Cuentas
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#64748b',
              marginTop: 4,
              margin: 0,
              marginBlockStart: 4,
            }}
          >
            Gestiona tus cuentas principales, deudas y cuotas
          </p>
        </div>
        <button
          onClick={handleCreateAccount}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={18} />
          Nueva Cuenta
        </button>
      </div>

      {/* Error */}
      {accountsError && (
        <div
          style={{
            marginBottom: 16,
            padding: 16,
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 12,
            color: '#fca5a5',
          }}
        >
          <p style={{ fontWeight: 700, margin: 0, marginBottom: 4 }}>Error:</p>
          <p style={{ margin: 0 }}>{accountsError}</p>
        </div>
      )}

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              pointerEvents: 'none',
            }}
          />
          <input
            placeholder="Buscar cuentas..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{
              width: '100%',
              height: 40,
              paddingLeft: 36,
              paddingRight: 12,
              background: '#1a2332',
              border: '1px solid #2d3748',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#2d3748')}
          />
        </div>

        <div style={{ width: 200 }}>
          <Select
            value={filters.type}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                type: val as AccountFilters['type'],
              }))
            }
          >
            <SelectTrigger className="bg-[#1a2332] border-[#2d3748] border text-[#e2e8f0] rounded-lg">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#2d3748] border">
              {typeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={filters.includeArchived}
            onChange={(e) => handleIncludeArchivedChange(e.target.checked)}
            style={{
              width: 16,
              height: 16,
              accentColor: '#10b981',
              cursor: 'pointer',
            }}
          />
          Incluir archivadas
        </label>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 0',
            color: '#94a3b8',
          }}
        >
          <p style={{ margin: 0 }}>Cargando cuentas...</p>
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
