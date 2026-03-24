/**
 * Hook para gestión de roles (CRUD)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { rolesHttpRepository } from '../../infrastructure/repositories/RolesHttpRepository';
import type { Role } from '../../domain/types/role.types';
import type { RoleFormData } from '../../application/validations/role.schema';

export function useRolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rolesHttpRepository.listRoles();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const createRole = useCallback(async (data: RoleFormData) => {
    setError(null);
    try {
      const newRole = await rolesHttpRepository.createRole(data);
      setRoles((prev) => [...prev, newRole]);
      return newRole;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear rol');
      throw err;
    }
  }, []);

  const updateRole = useCallback(async (id: number, data: RoleFormData) => {
    setError(null);
    try {
      const updatedRole = await rolesHttpRepository.updateRole(id, data);
      setRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)));
      return updatedRole;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rol');
      throw err;
    }
  }, []);

  const deleteRole = useCallback(async (id: number) => {
    setError(null);
    try {
      await rolesHttpRepository.deleteRole(id);
      setRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar rol');
      throw err;
    }
  }, []);

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refetch: fetchRoles,
  };
}
