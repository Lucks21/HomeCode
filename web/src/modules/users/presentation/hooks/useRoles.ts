'use client';

/**
 * Hook para gestionar roles
 */

import { useState, useEffect, useCallback } from 'react';
import { rolesRepository } from '../../infrastructure/repositories';
import type { Role } from '../../domain/types';

interface UseRolesOptions {
  enabled?: boolean;
}

export function useRoles({ enabled = true }: UseRolesOptions = {}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await rolesRepository.getAll();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles');
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
  };
}
