'use client';

import { useState, useEffect, useCallback } from 'react';
import { debtsRepository } from '../../infrastructure/repositories/DebtsHttpRepository';
import type { Debt, DebtFilters } from '../../domain/types';
import type { DebtFormData } from '../../application/validations/debt.schema';
import type { DebtPaymentFormData } from '../../application/validations/debtPayment.schema';

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async (filters?: Partial<DebtFilters>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await debtsRepository.getAll(filters);
      setDebts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deudas');
      console.error('Error fetching debts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDebt = useCallback(
    async (data: DebtFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await debtsRepository.create(data);
        await fetchDebts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear deuda');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDebts],
  );

  const registerPayment = useCallback(
    async (debtId: number, data: DebtPaymentFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await debtsRepository.registerPayment(debtId, data);
        await fetchDebts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al registrar pago');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDebts],
  );

  const archiveDebt = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await debtsRepository.archive(id);
        setDebts((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al archivar deuda');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const unarchiveDebt = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await debtsRepository.unarchive(id);
        await fetchDebts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al desarchivar deuda');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDebts],
  );

  const updateDebt = useCallback(
    async (id: number, data: { description?: string; date?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        await debtsRepository.update(id, data);
        await fetchDebts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar deuda');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDebts],
  );

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return {
    debts,
    isLoading,
    error,
    fetchDebts,
    createDebt,
    updateDebt,
    registerPayment,
    archiveDebt,
    unarchiveDebt,
  };
}
