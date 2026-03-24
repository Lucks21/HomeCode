/**
 * Header de la página de roles
 *
 * - Título
 * - Botón crear rol
 */

'use client';

import { Plus } from 'lucide-react';
import { PermissionButton } from '@/shared/presentation/components/PermissionButton';

interface RolesPageHeaderProps {
  onCreateRole: () => void;
}

export function RolesPageHeader({ onCreateRole }: RolesPageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b-2 border-foreground">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra los roles y permisos del sistema
        </p>
      </div>

      <PermissionButton requiredPermission="CREATE_ROLE" size="default" onClick={onCreateRole}>
        <Plus className="mr-2 h-4 w-4" />
        Crear Rol
      </PermissionButton>
    </div>
  );
}
