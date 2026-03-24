'use client';

/**
 * Hook para gestionar usuarios
 */

import { useState, useEffect, useCallback } from 'react';
import { usersRepository } from '../../infrastructure/repositories';
import type { User } from '../../domain/types';
import type { UserFormData } from '../../application/validations/user.schema';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersRepository.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (data: UserFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await usersRepository.create(data);
        // Recargar la lista completa después de crear
        await fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear usuario');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (id: number, data: UserFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        // Primero actualizar roles si se proporcionaron
        if (data.roleIds && data.roleIds.length > 0) {
          try {
            await usersRepository.assignRoles(id, data.roleIds);
          } catch (roleError) {
            console.warn('Error al asignar roles, continuando con actualización:', roleError);
          }
        }

        // Luego actualizar los datos del usuario
        await usersRepository.update(id, data);

        // Refetch para obtener los datos actualizados completos
        await fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers],
  );

  const activateUser = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersRepository.activate(id);
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, active: true } : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersRepository.deactivate(id);
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, active: false } : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleUserActive = useCallback(
    async (user: User) => {
      if (user.active) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
    },
    [activateUser, deactivateUser],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    activateUser,
    deactivateUser,
    toggleUserActive,
  };
}
