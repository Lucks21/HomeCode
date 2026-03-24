// Caso de uso: Login
// Autentica al usuario y genera un token JWT

import { UserRepository } from '../../../users/domain/repositories/UserRepository.interface';
import { RoleRepository } from '../../../users/domain/repositories/RoleRepository.interface';
import { PermissionRepository } from '../../../users/domain/repositories/PermissionRepository.interface';
import { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository.interface';
import { LoginCommand } from '../commands/LoginCommand';
import { LoginResult } from '../results/LoginResult';
import { PasswordHasher } from '../../domain/services/PasswordHasher.interface';
import { TokenGenerator } from '../ports/TokenGenerator.interface';
import { InvalidCredentialsException } from '../../domain/exceptions/InvalidCredentialsException';
import { InactiveUserException } from '../../domain/exceptions/InactiveUserException';
import { SettingsService } from '../../../../shared/settings/SettingsService';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly settingsService: SettingsService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verificar que el usuario esté activo
    if (!user.isActive()) {
      throw new InactiveUserException();
    }

    // Verificar contraseña usando el puerto PasswordHasher
    const isPasswordValid = await this.passwordHasher.compare(command.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Obtener roles del usuario
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

    // Generar token JWT usando el puerto TokenGenerator
    const accessToken = this.tokenGenerator.sign({
      sub: user.id,
      email: user.email.value,
      permissions: [...new Set(allPermissionCodes)], // Eliminar duplicados
    });

    // Generar refresh token (JWT con expiración más larga)
    const refreshTokenString = this.tokenGenerator.signRefresh({
      sub: user.id,
      email: user.email.value,
    });

    // Calcular fecha de expiración del refresh token
    const accessTokenExpiration = await this.settingsService.get<string>(
      'auth.access_token_ttl',
      '15m',
    );
    const refreshTokenExpiration = await this.settingsService.get<string>(
      'auth.refresh_token_ttl',
      '7d',
    );

    const refreshTokenExpiresAt = this.calculateExpirationDate(refreshTokenExpiration);

    // Guardar el refresh token en la base de datos
    // El repositorio eliminará automáticamente tokens antiguos del usuario
    await this.refreshTokenRepository.create(user.id, refreshTokenString, refreshTokenExpiresAt);

    // Retornar resultado del caso de uso
    return new LoginResult(
      accessToken,
      refreshTokenString,
      accessTokenExpiration,
      user.id,
      user.email.value,
      [...new Set(allPermissionCodes)],
    );
  }

  // Método auxiliar para calcular la fecha de expiración
  private calculateExpirationDate(expiration: string): Date {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const now = new Date();
    switch (unit) {
      case 's':
        return new Date(now.getTime() + value * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        throw new Error(`Invalid expiration unit: ${unit}`);
    }
  }
}
