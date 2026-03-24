/**
 * Hook para obtener todos los permisos del sistema
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { rolesHttpRepository } from '../../infrastructure/repositories/RolesHttpRepository';
import type { Permission, PermissionsByModule } from '../../domain/types/role.types';

/**
 * Extrae el módulo del código del permiso.
 * El orden importa: las claves más específicas deben ir primero.
 * Ej: PRODUCT_TYPE antes que PRODUCT, REPORT antes que MACHINE/CUSTOMER.
 */
function getModuleFromPermissionCode(code: string): string {
  const rules: [string, string][] = [
    // Más específicos primero
    ['PRODUCT_TYPE', 'TIPOS DE PRODUCTO'],
    ['PRODUCT', 'PRODUCTOS'],
    // DAILY_REPORT pertenece a CAJA, debe ir antes que REPORT
    ['DAILY_REPORT', 'CAJA'],
    // REPORT antes de MACHINE/CUSTOMER/RENTAL para capturar VIEW_xxx_REPORT
    ['REPORT', 'REPORTES'],
    ['MACHINE', 'MAQUINARIA'],
    // Acciones de arriendo que no contienen "RENTAL"
    ['RENTAL', 'ARRIENDOS'],
    ['RETURN', 'ARRIENDOS'], // REGISTER_RETURN, MARK_NO_RETURN
    ['CHARGE', 'ARRIENDOS'], // ADD_ADDITIONAL_CHARGE
    ['RESERVATION', 'ARRIENDOS'], // MANAGE_RESERVATIONS
    ['CASH', 'CAJA'],
    ['NOTIFICATION', 'NOTIFICACIONES'],
    ['MAINTENANCE', 'MANTENCIÓN'],
    ['USER', 'USUARIOS'],
    ['CUSTOMER', 'CLIENTES'],
    ['PERMISSION', 'ROLES'], // MANAGE_PERMISSIONS — antes de ROLE
    ['ROLE', 'ROLES'],
  ];

  for (const [key, label] of rules) {
    if (code.includes(key)) return label;
  }

  return 'OTROS';
}

export function useAllPermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByModule, setPermissionsByModule] = useState<PermissionsByModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rolesHttpRepository.listPermissions();
      setPermissions(data);

      // Agrupar por módulo
      const grouped = data.reduce((acc, permission) => {
        const module = getModuleFromPermissionCode(permission.code);
        const existing = acc.find((m) => m.module === module);
        if (existing) {
          existing.permissions.push(permission);
        } else {
          acc.push({ module, permissions: [permission] });
        }
        return acc;
      }, [] as PermissionsByModule[]);

      // Ordenar módulos y permisos dentro de cada módulo
      grouped.sort((a, b) => a.module.localeCompare(b.module));
      grouped.forEach((m) => m.permissions.sort((a, b) => a.code.localeCompare(b.code)));

      setPermissionsByModule(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    permissionsByModule,
    isLoading,
    error,
    refetch: fetchPermissions,
  };
}
