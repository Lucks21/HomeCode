'use client';

import { useState, useEffect, useCallback } from 'react';
import { transactionsRepository } from '../../infrastructure/repositories/TransactionsHttpRepository';
import type { Transaction, TransactionFilters } from '../../domain/types';
import type { TransactionFormData } from '../../application/validations/transaction.schema';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (filters?: Partial<TransactionFilters>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await transactionsRepository.getAll(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar transacciones');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTransaction = useCallback(
    async (data: TransactionFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await transactionsRepository.create(data);
        await fetchTransactions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear transacción');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTransactions],
  );

  const updateTransaction = useCallback(
    async (id: number, data: Partial<TransactionFormData>) => {
      setIsLoading(true);
      setError(null);
      try {
        await transactionsRepository.update(id, data);
        await fetchTransactions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar transacción');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTransactions],
  );

  const archiveTransaction = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await transactionsRepository.archive(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al archivar transacción');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    archiveTransaction,
  };
}
