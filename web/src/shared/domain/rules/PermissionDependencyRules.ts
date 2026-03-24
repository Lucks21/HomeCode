/**
 * Reglas de dependencia entre permisos.
 * Clave: código del permiso de acción.
 * Valor: array de códigos de permisos base requeridos.
 */
export const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
  CREATE_USER: ['READ_USER'],
  UPDATE_USER: ['READ_USER'],
  ACTIVATE_USER: ['READ_USER'],
  DEACTIVATE_USER: ['READ_USER'],
  DELETE_USER: ['READ_USER'],
  ASSIGN_ROLE: ['READ_USER', 'READ_ROLE'],
  CREATE_ROLE: ['READ_ROLE'],
  UPDATE_ROLE: ['READ_ROLE'],
  DELETE_ROLE: ['READ_ROLE'],
};
