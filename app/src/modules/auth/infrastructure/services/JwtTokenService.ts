// Adaptador de infraestructura para TokenService usando JWT
import { Injectable, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../application/ports/TokenService.interface';
import { SettingsService } from '../../../../shared/settings/SettingsService';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Optional() private readonly settingsService?: SettingsService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    const ttl = this.settingsService?.getCached<string>('auth.access_token_ttl', '15m') ?? '15m';
    return this.jwtService.signAsync(payload, { expiresIn: ttl as any });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    const ttl = this.settingsService?.getCached<string>('auth.refresh_token_ttl', '7d') ?? '7d';
    return this.jwtService.signAsync(payload, { expiresIn: ttl as any });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
