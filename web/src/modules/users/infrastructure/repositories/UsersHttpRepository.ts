/**
 * Repositorio HTTP para usuarios
 */

import { httpClient, type ApiResponse } from '@/shared/infrastructure';
import type { User, Role } from '../../domain/types';
import type { UserFormData } from '../../application/validations/user.schema';

interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  active: boolean;
  roles: {
    id: number;
    name: string;
  }[];
}

interface RoleApiResponse {
  id: number;
  name: string;
  permissions: {
    id: number;
    code: string;
    description: string;
  }[];
}

export class UsersHttpRepository {
  private readonly basePath = '/users';

  async getAll(): Promise<User[]> {
    const response = await httpClient.get<ApiResponse<UserApiResponse[]>>(this.basePath);

    return response.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      roles: user.roles,
    }));
  }

  async getById(id: number): Promise<User> {
    const response = await httpClient.get<ApiResponse<UserApiResponse>>(`${this.basePath}/${id}`);

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      active: response.data.active,
      roles: response.data.roles,
    };
  }

  async create(data: UserFormData): Promise<User> {
    const response = await httpClient.post<ApiResponse<UserApiResponse>>(this.basePath, {
      name: data.name,
      email: data.email,
      password: data.password,
      roleIds: data.roleIds,
    });

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      active: response.data.active,
      roles: response.data.roles,
    };
  }

  async update(id: number, data: UserFormData): Promise<User> {
    const payload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
    };

    // Solo incluir password si se proporciona
    if (data.password && data.password.length > 0) {
      payload.password = data.password;
    }

    const response = await httpClient.patch<ApiResponse<UserApiResponse>>(
      `${this.basePath}/${id}`,
      payload,
    );

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      active: response.data.active,
      roles: response.data.roles,
    };
  }

  async assignRoles(id: number, roleIds: number[]): Promise<void> {
    await httpClient.post<ApiResponse<void>>(`${this.basePath}/${id}/roles`, { roleIds });
  }

  async activate(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/activate`, {});
  }

  async deactivate(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/deactivate`, {});
  }
}

export class RolesHttpRepository {
  private readonly basePath = '/roles';

  async getAll(): Promise<Role[]> {
    const response = await httpClient.get<ApiResponse<RoleApiResponse[]>>(this.basePath);

    return response.data.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions,
    }));
  }
}

export const usersRepository = new UsersHttpRepository();
export const rolesRepository = new RolesHttpRepository();
