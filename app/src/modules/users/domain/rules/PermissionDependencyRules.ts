/**
 * Reglas de dominio: Dependencias entre permisos
 *
 * Regla de negocio: No debe existir un permiso de acción sin su permiso base de lectura.
 */

/**
 * Mapa de dependencias: permiso → permisos base requeridos (al menos uno).
 */
export const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
  // USUARIOS
  CREATE_USER: ['LIST_USERS', 'READ_USER'],
  UPDATE_USER: ['LIST_USERS', 'READ_USER'],
  ACTIVATE_USER: ['LIST_USERS', 'READ_USER'],
  DEACTIVATE_USER: ['LIST_USERS', 'READ_USER'],
  VIEW_USER_HISTORY: ['LIST_USERS', 'READ_USER'],

  // ROLES
  CREATE_ROLE: ['READ_ROLE'],
  UPDATE_ROLE: ['READ_ROLE'],
  DELETE_ROLE: ['READ_ROLE'],
  ASSIGN_ROLES: ['READ_ROLE', 'LIST_USERS', 'READ_USER'],
  REMOVE_ROLES: ['READ_ROLE', 'LIST_USERS', 'READ_USER'],
  MANAGE_PERMISSIONS: ['READ_ROLE'],

  // CLIENTES
  CREATE_CUSTOMER: ['READ_CUSTOMER', 'LIST_CUSTOMERS'],
  UPDATE_CUSTOMER: ['READ_CUSTOMER', 'LIST_CUSTOMERS'],
  DELETE_CUSTOMER: ['READ_CUSTOMER', 'LIST_CUSTOMERS'],

  // MAQUINARIA
  CREATE_MACHINE: ['READ_MACHINE', 'LIST_MACHINES'],
  UPDATE_MACHINE: ['READ_MACHINE', 'LIST_MACHINES'],
  DELETE_MACHINE: ['READ_MACHINE', 'LIST_MACHINES'],
  CHANGE_MACHINE_STATE: ['READ_MACHINE', 'LIST_MACHINES'],
  VIEW_MACHINE_HISTORY: ['READ_MACHINE', 'LIST_MACHINES'],
  VIEW_MACHINES_OUTSIDE: ['READ_MACHINE', 'LIST_MACHINES'],

  // PRODUCTOS
  CREATE_PRODUCT: ['READ_PRODUCT', 'LIST_PRODUCTS'],
  UPDATE_PRODUCT: ['READ_PRODUCT', 'LIST_PRODUCTS'],
  DELETE_PRODUCT: ['READ_PRODUCT', 'LIST_PRODUCTS'],
  ACTIVATE_PRODUCT: ['READ_PRODUCT', 'LIST_PRODUCTS'],
  DEACTIVATE_PRODUCT: ['READ_PRODUCT', 'LIST_PRODUCTS'],
  SEARCH_PRODUCTS: ['LIST_PRODUCTS'],
  LIST_ACTIVE_PRODUCTS: ['LIST_PRODUCTS'],
  LIST_INACTIVE_PRODUCTS: ['LIST_PRODUCTS'],

  CREATE_PRODUCT_TYPE: ['READ_PRODUCT_TYPE', 'LIST_PRODUCT_TYPES'],
  UPDATE_PRODUCT_TYPE: ['READ_PRODUCT_TYPE', 'LIST_PRODUCT_TYPES'],
  DELETE_PRODUCT_TYPE: ['READ_PRODUCT_TYPE', 'LIST_PRODUCT_TYPES'],
  ACTIVATE_PRODUCT_TYPE: ['READ_PRODUCT_TYPE', 'LIST_PRODUCT_TYPES'],
  DEACTIVATE_PRODUCT_TYPE: ['READ_PRODUCT_TYPE', 'LIST_PRODUCT_TYPES'],
  LIST_ACTIVE_PRODUCT_TYPES: ['LIST_PRODUCT_TYPES'],
  LIST_INACTIVE_PRODUCT_TYPES: ['LIST_PRODUCT_TYPES'],

  // ARRIENDOS
  CREATE_RENTAL: ['READ_RENTAL', 'LIST_RENTALS'],
  UPDATE_RENTAL: ['READ_RENTAL', 'LIST_RENTALS'],
  REGISTER_RETURN: ['READ_RENTAL', 'LIST_RENTALS'],
  GENERATE_RENTAL_PDF: ['READ_RENTAL', 'LIST_RENTALS'],
  ADD_ADDITIONAL_CHARGE: ['READ_RENTAL', 'LIST_RENTALS'],
  MARK_NO_RETURN: ['READ_RENTAL', 'LIST_RENTALS'],
  MANAGE_RESERVATIONS: ['READ_RENTAL', 'LIST_RENTALS'],
  VIEW_RENTAL_HISTORY: ['READ_RENTAL', 'LIST_RENTALS'],

  // CAJA
  OPEN_CASH_REGISTER: ['VIEW_CASH_REGISTER', 'LIST_CASH_REGISTERS'],
  CLOSE_CASH_REGISTER: ['VIEW_CASH_REGISTER', 'LIST_CASH_REGISTERS'],
  CREATE_CASH_MOVEMENT: ['VIEW_CASH_REGISTER', 'LIST_CASH_REGISTERS'],
  REVERSE_CASH_MOVEMENT: ['VIEW_CASH_REGISTER', 'LIST_CASH_REGISTERS'],
  VIEW_CASH_SUMMARY: ['VIEW_CASH_REGISTER'],
  VIEW_DAILY_REPORT: ['VIEW_CASH_REGISTER', 'LIST_CASH_REGISTERS'],

  // NOTIFICACIONES
  MANAGE_NOTIFICATIONS: ['VIEW_NOTIFICATIONS'],
};

/**
 * Valida la coherencia de un conjunto de códigos de permisos.
 * @returns Array de mensajes de error (vacío si todo es válido)
 */
export function validatePermissionCoherence(permissionCodes: string[]): string[] {
  const errors: string[] = [];
  const codeSet = new Set(permissionCodes);

  for (const code of permissionCodes) {
    const requiredBases = PERMISSION_DEPENDENCIES[code];
    if (!requiredBases) continue;

    const hasBase = requiredBases.some((base) => codeSet.has(base));
    if (!hasBase) {
      const basesStr = requiredBases.join(' o ');
      errors.push(`El permiso "${code}" requiere al menos uno de: ${basesStr}`);
    }
  }

  return errors;
}

/**
 * Dado un conjunto de códigos de permisos, retorna los permisos base
 * que deben auto-seleccionarse para mantener coherencia.
 */
export function getMissingBasePermissions(permissionCodes: string[]): string[] {
  const codeSet = new Set(permissionCodes);
  const missing: Set<string> = new Set();

  for (const code of permissionCodes) {
    const requiredBases = PERMISSION_DEPENDENCIES[code];
    if (!requiredBases) continue;

    const hasBase = requiredBases.some((base) => codeSet.has(base));
    if (!hasBase) {
      missing.add(requiredBases[0]);
    }
  }

  return Array.from(missing);
}
