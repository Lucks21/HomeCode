// Entidad de dominio Usuario
// Representa un usuario del sistema con sus reglas de negocio

import { Email } from '../value-objects/Email.vo';
import { Password } from '../value-objects/Password.vo';

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: Email,
    public passwordHash: string,
    public active: boolean,
    public roleIds: number[],
  ) {}

  // Factory method para crear un nuevo usuario
  static create(
    id: number,
    name: string,
    email: string,
    passwordHash: string,
    active: boolean = true,
    roleIds: number[] = [],
  ): User {
    return new User(id, name, Email.create(email), passwordHash, active, roleIds);
  }

  // Regla de negocio: Activar usuario
  activate(): void {
    if (this.active) {
      throw new Error('El usuario ya está activo');
    }
    this.active = true;
  }

  // Regla de negocio: Desactivar usuario
  deactivate(): void {
    if (!this.active) {
      throw new Error('El usuario ya está inactivo');
    }
    this.active = false;
  }

  // Regla de negocio: Actualizar información básica
  updateBasicInfo(name: string, email: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    this.name = name;
    this.email = Email.create(email);
  }

  // Regla de negocio: Cambiar contraseña
  updatePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.length === 0) {
      throw new Error('El hash de contraseña no puede estar vacío');
    }
    this.passwordHash = newPasswordHash;
  }

  // Regla de negocio: Asignar roles
  assignRoles(roleIds: number[]): void {
    if (!roleIds || roleIds.length === 0) {
      throw new Error('Debe asignar al menos un rol');
    }
    this.roleIds = [...new Set(roleIds)]; // Eliminar duplicados
  }

  // Regla de negocio: Verificar si tiene un rol específico
  hasRole(roleId: number): boolean {
    return this.roleIds.includes(roleId);
  }

  // Regla de negocio: Verificar si está activo
  isActive(): boolean {
    return this.active;
  }

  // Convertir a objeto plano para persistencia
  toPrimitives(): {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    active: boolean;
    roleIds: number[];
  } {
    return {
      id: this.id,
      name: this.name,
      email: this.email.value,
      passwordHash: this.passwordHash,
      active: this.active,
      roleIds: this.roleIds,
    };
  }
}
