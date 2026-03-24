// Caso de uso: RefreshToken
// Valida el refresh token y genera un nuevo access token

import { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository.interface';
import { UserRepository } from '../../../users/domain/repositories/UserRepository.interface';
import { RoleRepository } from '../../../users/domain/repositories/RoleRepository.interface';
import { PermissionRepository } from '../../../users/domain/repositories/PermissionRepository.interface';
import { RefreshTokenCommand } from '../commands/RefreshTokenCommand';
import { RefreshTokenResult } from '../results/RefreshTokenResult';
import { TokenGenerator } from '../ports/TokenGenerator.interface';
import { InvalidRefreshTokenException } from '../../domain/exceptions/InvalidRefreshTokenException';
import { ExpiredRefreshTokenException } from '../../domain/exceptions/ExpiredRefreshTokenException';
import { InactiveUserException } from '../../domain/exceptions/InactiveUserException';
import { SettingsService } from '../../../../shared/settings/SettingsService';

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly settingsService: SettingsService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    // Buscar el refresh token en la base de datos
    const refreshToken = await this.refreshTokenRepository.findByToken(command.refreshToken);

    if (!refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    // Verificar si el token ha expirado
    if (refreshToken.isExpired()) {
      // Eliminar el token expirado
      await this.refreshTokenRepository.deleteByToken(command.refreshToken);
      throw new ExpiredRefreshTokenException();
    }

    // Buscar el usuario asociado al refresh token
    const user = await this.userRepository.findById(refreshToken.userId);
    if (!user) {
      throw new InvalidRefreshTokenException();
    }

    // Verificar que el usuario esté activo
    if (!user.isActive()) {
      throw new InactiveUserException();
    }

    // Obtener roles y permisos del usuario
    const roleIds = await this.userRepository.getUserRoles(user.id);
    const allPermissionCodes: string[] = [];

    for (const roleId of roleIds) {
      const role = await this.roleRepository.findById(roleId);
      if (role) {
        // Obtener permisos del rol
        const permissionIds = await this.roleRepository.getRolePermissions(roleId);
        const permissions = await this.permissionRepository.findByIds(permissionIds);

        // Agregar códigos de permisos para el JWT payload
        allPermissionCodes.push(...permissions.map((p) => p.code));
      }
    }

    // Generar nuevo access token con los permisos actualizados
    const accessToken = this.tokenGenerator.sign({
      sub: user.id,
      email: user.email.value,
      permissions: [...new Set(allPermissionCodes)], // Eliminar duplicados
    });

    // Retornar el nuevo access token
    const accessTokenExpiration = await this.settingsService.get<string>(
      'JWT_ACCESS_TOKEN_EXPIRATION',
      '15m',
    );
    return new RefreshTokenResult(accessToken, accessTokenExpiration);
  }
}
