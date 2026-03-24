// Módulo de Autenticación para NestJS
// Configura JWT, Passport y casos de uso de auth

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';
import { SettingsService } from '../../../shared/settings/SettingsService';

// Estrategias
import { JwtStrategy } from './security/strategies/JwtStrategy';

// Controlador
import { AuthController } from '../interfaces/http/controllers/auth.controller';

// Casos de uso
import { LoginUseCase } from '../application/use-cases/Login.usecase';
import { ForgotPasswordUseCase } from '../application/use-cases/ForgotPassword.usecase';
import { VerifyResetCodeUseCase } from '../application/use-cases/VerifyResetCode.usecase';
import { ResetPasswordUseCase } from '../application/use-cases/ResetPassword.usecase';
import { RefreshTokenUseCase } from '../application/use-cases/RefreshToken.usecase';
import { LogoutUseCase } from '../application/use-cases/Logout.usecase';
import { GetProfileUseCase } from '../application/use-cases/GetProfile.usecase';

// Adaptadores de seguridad
import { BcryptPasswordHasher } from './security/adapters/BcryptPasswordHasher';
import { JwtTokenGenerator } from './security/adapters/JwtTokenGenerator';
import { RandomCodeGenerator } from './security/adapters/RandomCodeGenerator';
import { NodemailerEmailSender } from './security/adapters/NodemailerEmailSender';

// Adaptadores de persistencia
import { PrismaPasswordResetRepository } from './persistence/PrismaPasswordResetRepository';
import { PrismaRefreshTokenRepository } from './persistence/PrismaRefreshTokenRepository';

// Repositorios importados desde UsersModule
import { USER_REPOSITORY, ROLE_REPOSITORY, PERMISSION_REPOSITORY } from '../../users/Users.Tokens';
import { PrismaUserRepository } from '../../users/infrastructure/persistence/PrismaUserRepository';
import { PrismaRoleRepository } from '../../users/infrastructure/persistence/PrismaRoleRepository';
import { PrismaPermissionRepository } from '../../users/infrastructure/persistence/PrismaPermissionRepository';

// Tokens para inyección de dependencias
export const PASSWORD_HASHER = 'PASSWORD_HASHER';
export const TOKEN_GENERATOR = 'TOKEN_GENERATOR';
export const CODE_GENERATOR = 'CODE_GENERATOR';
export const EMAIL_SENDER = 'EMAIL_SENDER';
export const PASSWORD_RESET_REPOSITORY = 'PASSWORD_RESET_REPOSITORY';
export const REFRESH_TOKEN_REPOSITORY = 'REFRESH_TOKEN_REPOSITORY';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET', 'SECRET_KEY_CHANGE_IN_PRODUCTION');
        const expiresIn = configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION', '15m');
        return {
          secret,
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SettingsService,
    // Repositorios
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: PASSWORD_RESET_REPOSITORY,
      useClass: PrismaPasswordResetRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    // Adaptadores de seguridad
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_GENERATOR,
      useFactory: (
        jwtService: JwtService,
        configService: ConfigService,
        settingsService: SettingsService,
      ) => new JwtTokenGenerator(jwtService, configService, settingsService),
      inject: [JwtService, ConfigService, SettingsService],
    },
    {
      provide: CODE_GENERATOR,
      useClass: RandomCodeGenerator,
    },
    {
      provide: EMAIL_SENDER,
      useClass: NodemailerEmailSender,
    },
    // Caso de uso de Login
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: PrismaUserRepository,
        roleRepo: PrismaRoleRepository,
        permissionRepo: PrismaPermissionRepository,
        refreshTokenRepo: PrismaRefreshTokenRepository,
        passwordHasher: BcryptPasswordHasher,
        tokenGenerator: JwtTokenGenerator,
        settingsService: SettingsService,
      ) =>
        new LoginUseCase(
          userRepo,
          roleRepo,
          permissionRepo,
          refreshTokenRepo,
          passwordHasher,
          tokenGenerator,
          settingsService,
        ),
      inject: [
        USER_REPOSITORY,
        ROLE_REPOSITORY,
        PERMISSION_REPOSITORY,
        REFRESH_TOKEN_REPOSITORY,
        PASSWORD_HASHER,
        TOKEN_GENERATOR,
        SettingsService,
      ],
    },
    // Caso de uso de ForgotPassword
    {
      provide: ForgotPasswordUseCase,
      useFactory: (
        userRepo: PrismaUserRepository,
        passwordResetRepo: PrismaPasswordResetRepository,
        codeGenerator: RandomCodeGenerator,
        emailSender: NodemailerEmailSender,
        settingsService: SettingsService,
      ) =>
        new ForgotPasswordUseCase(
          userRepo,
          passwordResetRepo,
          codeGenerator,
          emailSender,
          settingsService,
        ),
      inject: [
        USER_REPOSITORY,
        PASSWORD_RESET_REPOSITORY,
        CODE_GENERATOR,
        EMAIL_SENDER,
        SettingsService,
      ],
    },
    // Caso de uso de VerifyResetCode
    {
      provide: VerifyResetCodeUseCase,
      useFactory: (
        userRepo: PrismaUserRepository,
        passwordResetRepo: PrismaPasswordResetRepository,
      ) => new VerifyResetCodeUseCase(userRepo, passwordResetRepo),
      inject: [USER_REPOSITORY, PASSWORD_RESET_REPOSITORY],
    },
    // Caso de uso de ResetPassword
    {
      provide: ResetPasswordUseCase,
      useFactory: (
        userRepo: PrismaUserRepository,
        passwordResetRepo: PrismaPasswordResetRepository,
        passwordHasher: BcryptPasswordHasher,
      ) => new ResetPasswordUseCase(userRepo, passwordResetRepo, passwordHasher),
      inject: [USER_REPOSITORY, PASSWORD_RESET_REPOSITORY, PASSWORD_HASHER],
    },
    // Caso de uso de RefreshToken
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        refreshTokenRepo: PrismaRefreshTokenRepository,
        userRepo: PrismaUserRepository,
        roleRepo: PrismaRoleRepository,
        permissionRepo: PrismaPermissionRepository,
        tokenGenerator: JwtTokenGenerator,
        settingsService: SettingsService,
      ) =>
        new RefreshTokenUseCase(
          refreshTokenRepo,
          userRepo,
          roleRepo,
          permissionRepo,
          tokenGenerator,
          settingsService,
        ),
      inject: [
        REFRESH_TOKEN_REPOSITORY,
        USER_REPOSITORY,
        ROLE_REPOSITORY,
        PERMISSION_REPOSITORY,
        TOKEN_GENERATOR,
        SettingsService,
      ],
    },
    // Caso de uso de Logout
    {
      provide: LogoutUseCase,
      useFactory: (refreshTokenRepo: PrismaRefreshTokenRepository) =>
        new LogoutUseCase(refreshTokenRepo),
      inject: [REFRESH_TOKEN_REPOSITORY],
    },
    // Caso de uso de GetProfile
    {
      provide: GetProfileUseCase,
      useFactory: (userRepo: PrismaUserRepository) => new GetProfileUseCase(userRepo),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [JwtStrategy, JwtModule],
})
export class AuthModule {}
