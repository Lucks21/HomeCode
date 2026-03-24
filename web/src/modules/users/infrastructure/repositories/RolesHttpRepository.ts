/**
 * Repositorio HTTP para Roles
 */

import { httpClient } from '@/shared/infrastructure/http/HttpClient';
import type { Role, Permission } from '../../domain/types/role.types';
import type { RoleFormData } from '../../application/validations/role.schema';

export class RolesHttpRepository {
  private readonly basePath = '/roles';
  private readonly permissionsPath = '/permissions';

  async listRoles(): Promise<Role[]> {
    const response = await httpClient.get<{
      message: string;
      data: Array<{
        id: number;
        name: string;
        permissions: Array<{
          id: number;
          code: string;
          description: string | null;
        }>;
      }>;
    }>(this.basePath);

    return response.data.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions,
    }));
  }

  async getRoleById(id: number): Promise<Role> {
    const response = await httpClient.get<{
      message: string;
      data: {
        id: number;
        name: string;
        permissions: Array<{
          id: number;
          code: string;
          description: string | null;
        }>;
      };
    }>(`${this.basePath}/${id}`);

    return {
      id: response.data.id,
      name: response.data.name,
      permissions: response.data.permissions,
    };
  }

  async createRole(data: RoleFormData): Promise<Role> {
    const response = await httpClient.post<{
      message: string;
      data: {
        id: number;
        name: string;
        permissionIds: number[];
      };
    }>(this.basePath, {
      name: data.name,
      permissionIds: data.permissionIds,
    });

    // Obtener el rol completo con permisos
    return this.getRoleById(response.data.id);
  }

  async updateRole(id: number, data: RoleFormData): Promise<Role> {
    const response = await httpClient.patch<{
      message: string;
      data: {
        id: number;
        name: string;
        permissionIds: number[];
      };
    }>(`${this.basePath}/${id}`, {
      name: data.name,
      permissionIds: data.permissionIds,
    });

    // Obtener el rol completo con permisos
    return this.getRoleById(response.data.id);
  }

  async deleteRole(id: number): Promise<void> {
    await httpClient.delete(`${this.basePath}/${id}`);
  }

  async listPermissions(): Promise<Permission[]> {
    const response = await httpClient.get<{
      message: string;
      data: Array<{
        id: number;
        code: string;
        description: string | null;
      }>;
    }>(this.permissionsPath);

    return response.data;
  }
}

export const rolesHttpRepository = new RolesHttpRepository();
