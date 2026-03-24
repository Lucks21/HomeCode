'use client';

import { useState, useEffect, useCallback } from 'react';
import { debtsRepository } from '../../infrastructure/repositories/DebtsHttpRepository';
import type { Debt } from '../../domain/types';

export function useDebtDetail(debtId: number | null) {
  const [debt, setDebt] = useState<Debt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebt = useCallback(async () => {
    if (!debtId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await debtsRepository.getById(debtId);
      setDebt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle de deuda');
      console.error('Error fetching debt detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [debtId]);

  useEffect(() => {
    fetchDebt();
  }, [fetchDebt]);

  return {
    debt,
    isLoading,
    error,
    refetch: fetchDebt,
  };
}
