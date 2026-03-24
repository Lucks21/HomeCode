// Mapper para transformar entre capas de Role
import { Role } from '../../domain/entities/Role.entity';
import { RoleResponseDto } from '../../interfaces/http/dto/response/RoleResponse.dto';

export class RoleMapper {
  static toResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissionIds.map((id) => ({
        id,
        code: '', // Se completa con datos del repositorio si es necesario
        description: '',
      })),
    };
  }

  static toResponseDtoArray(roles: Role[]): RoleResponseDto[] {
    return roles.map((r) => this.toResponseDto(r));
  }
}
