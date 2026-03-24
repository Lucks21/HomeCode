/**
 * Header de la página de usuarios
 *
 * - Título
 * - Botón crear usuario
 * - Botón gestionar roles
 */

'use client';

import { Plus, Shield } from 'lucide-react';
import { PermissionButton } from '@/shared/presentation/components/PermissionButton';
import { ModulePageHeader } from '@/shared/presentation/components/ModulePageHeader';

interface UsersPageHeaderProps {
  onCreateUser: () => void;
  onManageRoles: () => void;
}

export function UsersPageHeader({ onCreateUser, onManageRoles }: UsersPageHeaderProps) {
  return (
    <ModulePageHeader
      title="Gestión de Usuarios y Roles"
      description="Administra los usuarios, roles y permisos del sistema"
      className="pb-4 border-b-2 border-foreground"
      actions={
        <>
          <PermissionButton
            requiredPermission="READ_ROLE"
            size="default"
            variant="outline"
            onClick={onManageRoles}
          >
            <Shield className="mr-2 h-4 w-4" />
            Gestionar Roles
          </PermissionButton>

          <PermissionButton requiredPermission="CREATE_USER" size="default" onClick={onCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Usuario
          </PermissionButton>
        </>
      }
    />
  );
}
