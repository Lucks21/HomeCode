'use client';

/**
 * Hook para obtener detalle de una cuenta
 */

import { useState, useEffect, useCallback } from 'react';
import { accountsRepository } from '../../infrastructure/repositories/AccountsHttpRepository';
import type { AccountDetail } from '../../domain/types';

export function useAccountDetail(accountId: number) {
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!accountId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await accountsRepository.getById(accountId);
      setAccountDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle de cuenta');
      console.error('Error fetching account detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    accountDetail,
    isLoading,
    error,
    fetchDetail,
  };
}
