'use client';

import { useState, useEffect, useCallback } from 'react';
import { installmentsRepository } from '../../infrastructure/repositories/InstallmentsHttpRepository';
import type { Installment } from '../../domain/types';

export function useInstallmentDetail(installmentId: number | null) {
  const [installment, setInstallment] = useState<Installment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstallment = useCallback(async () => {
    if (!installmentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await installmentsRepository.getById(installmentId);
      setInstallment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
      console.error('Error fetching installment detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [installmentId]);

  useEffect(() => {
    fetchInstallment();
  }, [fetchInstallment]);

  return {
    installment,
    isLoading,
    error,
    refetch: fetchInstallment,
  };
}
