/**
 * Tipos de dominio para Roles y Permisos
 */

export interface Permission {
  id: number;
  code: string;
  description: string | null;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface PermissionsByModule {
  module: string;
  permissions: Permission[];
}
