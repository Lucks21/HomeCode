'use client';

import { useState, useEffect, useCallback } from 'react';
import { installmentsRepository } from '../../infrastructure/repositories/InstallmentsHttpRepository';
import type { Installment } from '../../domain/types';
import type { InstallmentFormData } from '../../application/validations/installment.schema';

export function useInstallments() {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstallments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await installmentsRepository.getAll();
      setInstallments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cuotas');
      console.error('Error fetching installments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInstallment = useCallback(
    async (data: InstallmentFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await installmentsRepository.create(data);
        await fetchInstallments();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear cuota');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchInstallments],
  );

  const payInstallments = useCallback(
    async (id: number, count: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await installmentsRepository.payInstallments(id, count);
        await fetchInstallments();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al pagar cuotas');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchInstallments],
  );

  const archiveInstallment = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await installmentsRepository.archive(id);
        setInstallments((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al archivar');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchInstallments();
  }, [fetchInstallments]);

  return {
    installments,
    isLoading,
    error,
    fetchInstallments,
    createInstallment,
    payInstallments,
    archiveInstallment,
  };
}
