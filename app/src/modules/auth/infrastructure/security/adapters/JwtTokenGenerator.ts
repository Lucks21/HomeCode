// Adaptador de JWT para el puerto TokenGenerator
// Implementación concreta de la generación de tokens usando @nestjs/jwt

import { Injectable, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  TokenGenerator,
  TokenPayload,
  RefreshTokenPayload,
} from '../../../application/ports/TokenGenerator.interface';
import { SettingsService } from '../../../../../shared/settings/SettingsService';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Optional() private readonly settingsService?: SettingsService,
  ) {}

  sign(payload: TokenPayload): string {
    const accessTokenTtl = this.settingsService
      ? this.settingsService.getCached<string>('auth.access_token_ttl', '15m')
      : this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION', '15m');

    return this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
        permissions: payload.permissions,
      },
      {
        expiresIn: accessTokenTtl as any,
      },
    );
  }

  signRefresh(payload: RefreshTokenPayload): string {
    const refreshTokenTtl = this.settingsService
      ? this.settingsService.getCached<string>('auth.refresh_token_ttl', '7d')
      : this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION', '7d');

    return this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
      },
      {
        expiresIn: refreshTokenTtl as any,
      },
    );
  }

  verify(token: string): TokenPayload {
    const decoded = this.jwtService.verify(token);
    return {
      sub: decoded.sub,
      email: decoded.email,
      permissions: decoded.permissions || [],
    };
  }
}
