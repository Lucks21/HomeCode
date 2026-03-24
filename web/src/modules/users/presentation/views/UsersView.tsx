'use client';

/**
 * Vista principal del módulo Users
 *
 * Integra todos los componentes:
 * - Header con botón crear
 * - Barra de filtros
 * - Tabla de usuarios
 * - Paginación
 * - Modal crear/editar
 */

import { useState, useMemo } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { UsersPageHeader } from '../components/UsersPageHeader';
import { UsersFiltersBar } from '../components/UsersFiltersBar';
import { UsersTable } from '../components/UsersTable';
import { PaginationControls } from '@/shared/presentation/components/ui';
import { UserFormModal } from '../components/UserFormModal';
import { RolesManagementModal } from '../components/RolesManagementModal';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '@/modules/auth/presentation/hooks/usePermissions';
import { useAuth } from '@/modules/auth';
import { useToast } from '@/shared/presentation/hooks/useToast';
import { ToastNotifications } from '@/shared/presentation/components/ui/ToastNotifications';
import { useClientPagination } from '@/shared/presentation/hooks/useClientPagination';
import type { User, UserFilters } from '../../domain/types';
import type { UserFormData } from '../../application/validations/user.schema';

const defaultFilters: UserFilters = {
  search: '',
  status: 'TODOS',
  roleId: null,
};

export function UsersView() {
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);

  // Estado para modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Hooks para datos
  const {
    users,
    isLoading,
    error: usersError,
    createUser,
    updateUser,
    toggleUserActive,
  } = useUsers();
  const { hasPermission } = usePermissions();
  const {
    roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useRoles({ enabled: hasPermission('READ_ROLE') });
  const { user: currentUser } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    return users.filter((user) => {
      const matchesSearch =
        filters.search === '' ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === 'TODOS' ||
        (filters.status === 'ACTIVOS' && user.active) ||
        (filters.status === 'INACTIVOS' && !user.active);

      const matchesRole = !filters.roleId || user.roles.some((role) => role.id === filters.roleId);

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, filters]);

  const {
    paginatedItems: paginatedUsers,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useClientPagination(filteredUsers, { itemsPerPage: 10 });

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleManageRoles = () => {
    setIsRolesModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    if (user.active && currentUser && user.id === currentUser.id) {
      showError('No puedes desactivar tu propio usuario mientras estás conectado');
      return;
    }
    try {
      await toggleUserActive(user);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
    }
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setFormError(null);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        success('Usuario actualizado exitosamente');
      } else {
        await createUser(data);
        success('Usuario creado exitosamente');
      }
      setIsFormModalOpen(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Error al guardar usuario');
      setFormError(errorMessage);
      console.error('Error al guardar usuario:', error);
      showError(errorMessage);
    }
  };
  {
    (usersError || rolesError) && (
      <div className="mb-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive">
        <p className="font-bold">Error:</p>
        <p>{usersError || rolesError}</p>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <ToastNotifications toasts={toasts} onClose={removeToast} />

      <UsersPageHeader onCreateUser={handleCreateUser} onManageRoles={handleManageRoles} />

      <UsersFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        roles={roles?.map((role) => ({ id: role.id, name: role.name })) || []}
      />

      <div className="mt-4">
        <UsersTable
          users={paginatedUsers}
          onEdit={handleEditUser}
          onToggleActive={handleToggleActive}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Crear/Editar Usuario */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        roles={roles || []}
        isLoading={isLoading}
      />

      {/* Modal Gestión de Roles */}
      <RolesManagementModal isOpen={isRolesModalOpen} onClose={() => setIsRolesModalOpen(false)} />
    </>
  );
}
