'use client';

/**
 * Hook para gestionar cuentas
 */

import { useState, useEffect, useCallback } from 'react';
import { accountsRepository } from '../../infrastructure/repositories/AccountsHttpRepository';
import type { Account } from '../../domain/types';
import type { AccountFormData } from '../../application/validations/account.schema';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async (includeArchived: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await accountsRepository.getAll(includeArchived);
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cuentas');
      console.error('Error fetching accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (data: AccountFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await accountsRepository.create(data);
        await fetchAccounts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear cuenta');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAccounts],
  );

  const updateAccount = useCallback(
    async (id: number, data: Partial<AccountFormData>) => {
      setIsLoading(true);
      setError(null);
      try {
        await accountsRepository.update(id, data);
        await fetchAccounts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar cuenta');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAccounts],
  );

  const archiveAccount = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await accountsRepository.archive(id);
        await fetchAccounts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al archivar cuenta');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAccounts],
  );

  const unarchiveAccount = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await accountsRepository.unarchive(id);
        await fetchAccounts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al desarchivar cuenta');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAccounts],
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    archiveAccount,
    unarchiveAccount,
  };
}
