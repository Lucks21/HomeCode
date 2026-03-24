// Controlador HTTP de Autenticación
// Maneja el login, obtención de usuario autenticado y restablecimiento de contraseña

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  RateLimitGuard,
  RateLimit,
  RateLimitConfig,
  SkipRateLimit,
} from '../../../../../infrastructure/guards/CustomThrottlerGuard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/Login.usecase';
import { ForgotPasswordUseCase } from '../../../application/use-cases/ForgotPassword.usecase';
import { VerifyResetCodeUseCase } from '../../../application/use-cases/VerifyResetCode.usecase';
import { ResetPasswordUseCase } from '../../../application/use-cases/ResetPassword.usecase';
import { RefreshTokenUseCase } from '../../../application/use-cases/RefreshToken.usecase';
import { LogoutUseCase } from '../../../application/use-cases/Logout.usecase';
import { GetProfileUseCase } from '../../../application/use-cases/GetProfile.usecase';
import { LoginRequestDto } from '../dto/request/LoginRequest.dto';
import { ForgotPasswordRequestDto } from '../dto/request/ForgotPasswordRequest.dto';
import { VerifyResetCodeRequestDto } from '../dto/request/VerifyResetCodeRequest.dto';
import { ResetPasswordRequestDto } from '../dto/request/ResetPasswordRequest.dto';
import { RefreshTokenRequestDto } from '../dto/request/RefreshTokenRequest.dto';
import { LoginResponseDto } from '../dto/response/LoginResponse.dto';
import { ForgotPasswordResponseDto } from '../dto/response/ForgotPasswordResponse.dto';
import { VerifyResetCodeResponseDto } from '../dto/response/VerifyResetCodeResponse.dto';
import { ResetPasswordResponseDto } from '../dto/response/ResetPasswordResponse.dto';
import { RefreshTokenResponseDto } from '../dto/response/RefreshTokenResponse.dto';
import { LoginCommand } from '../../../application/commands/LoginCommand';
import { ForgotPasswordCommand } from '../../../application/commands/ForgotPasswordCommand';
import { VerifyResetCodeCommand } from '../../../application/commands/VerifyResetCodeCommand';
import { ResetPasswordCommand } from '../../../application/commands/ResetPasswordCommand';
import { RefreshTokenCommand } from '../../../application/commands/RefreshTokenCommand';
import { LogoutCommand } from '../../../application/commands/LogoutCommand';
import { GetProfileCommand } from '../../../application/commands/GetProfileCommand';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/JwtAuthGuard';

// Interface para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    permissions: string[];
  };
}

@ApiTags('auth')
@UseGuards(RateLimitGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetCodeUseCase: VerifyResetCodeUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  // Login - Autenticar usuario y obtener token
  @RateLimitConfig('auth.login_rate_limit_attempts', 'auth.login_rate_limit_ttl_ms', 5, 60000)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuario',
    description: 'Login con email y password. Retorna JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso. Retorna access token.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos de login. Espera 1 minuto.',
  })
  async login(@Body() body: LoginRequestDto) {
    const command = new LoginCommand(body.email, body.password);
    const result = await this.loginUseCase.execute(command);
    return new LoginResponseDto(result.accessToken, result.refreshToken, result.expiresIn);
  }

  // Obtener usuario autenticado actual
  @SkipRateLimit() // No aplicar rate limiting (ya protegido por JWT)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener usuario autenticado',
    description: 'Retorna los datos del usuario actualmente autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario autenticado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado o token inválido',
  })
  async getProfile(@Request() req: AuthenticatedRequest) {
    // Obtener perfil completo del usuario desde la base de datos
    const command = new GetProfileCommand(req.user.id);
    const userResult = await this.getProfileUseCase.execute(command);

    return {
      message: 'Usuario autenticado',
      data: {
        id: userResult.user.id,
        name: userResult.user.name,
        email: userResult.user.email.value,
        active: userResult.user.active,
      },
    };
  }

  // Solicitar restablecimiento de contraseña
  @RateLimitConfig(
    'auth.forgot_password_rate_limit_attempts',
    'auth.login_rate_limit_ttl_ms',
    3,
    60000,
  )
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar código de restablecimiento',
    description:
      'Envía un código de 6 dígitos al email del usuario para restablecer su contraseña. El código expira en 15 minutos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Código enviado exitosamente',
    type: ForgotPasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email inválido o error al enviar código',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes. Espera 1 minuto.',
  })
  async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
    const command = new ForgotPasswordCommand(body.email);
    const result = await this.forgotPasswordUseCase.execute(command);
    return new ForgotPasswordResponseDto(result.message);
  }

  // Verificar código de restablecimiento
  @RateLimitConfig('auth.verify_code_rate_limit_attempts', 'auth.login_rate_limit_ttl_ms', 5, 60000)
  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar código de restablecimiento',
    description:
      'Valida el código de 6 dígitos recibido por email. Retorna si el código es válido y no ha expirado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Código verificado',
    type: VerifyResetCodeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido, expirado o ya usado',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos de verificación. Espera 1 minuto.',
  })
  async verifyResetCode(@Body() body: VerifyResetCodeRequestDto) {
    const command = new VerifyResetCodeCommand(body.email, body.code);
    const result = await this.verifyResetCodeUseCase.execute(command);
    return new VerifyResetCodeResponseDto(result.valid, result.message);
  }

  // Restablecer contraseña
  @RateLimitConfig(
    'auth.reset_password_rate_limit_attempts',
    'auth.login_rate_limit_ttl_ms',
    3,
    60000,
  )
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description:
      'Restablece la contraseña del usuario usando el código de 6 dígitos validado previamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido, contraseñas no coinciden o no cumple requisitos',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos. Espera 1 minuto.',
  })
  async resetPassword(@Body() body: ResetPasswordRequestDto) {
    const command = new ResetPasswordCommand(
      body.email,
      body.code,
      body.newPassword,
      body.confirmPassword,
    );
    const result = await this.resetPasswordUseCase.execute(command);
    return new ResetPasswordResponseDto(result.message);
  }

  // Refrescar access token usando refresh token
  @RateLimitConfig(
    'auth.resend_code_rate_limit_attempts',
    'auth.login_rate_limit_ttl_ms',
    10,
    60000,
  )
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar access token',
    description:
      'Genera un nuevo access token usando el refresh token. El refresh token debe ser válido y no expirado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes. Espera 1 minuto.',
  })
  async refreshToken(@Body() body: RefreshTokenRequestDto) {
    const command = new RefreshTokenCommand(body.refreshToken);
    const result = await this.refreshTokenUseCase.execute(command);
    return new RefreshTokenResponseDto(result.accessToken, result.expiresIn);
  }

  // Logout - Invalidar refresh token
  @SkipRateLimit() // No aplicar rate limiting (ya protegido por JWT)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Invalida el refresh token del usuario autenticado. El access token seguirá siendo válido hasta que expire.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async logout(@Request() req: AuthenticatedRequest) {
    // Ejecutar caso de uso de Logout
    const command = new LogoutCommand(req.user.id);
    const result = await this.logoutUseCase.execute(command);
    return {
      message: result.message,
      data: null,
    };
  }
}
