// Estrategia JWT para Passport
// Valida y decodifica los tokens JWT en las peticiones

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number; // User ID
  email: string;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido');
    }

    // Retornar el usuario que se agregará a request.user
    return {
      id: payload.sub,
      email: payload.email,
      permissions: payload.permissions || [],
    };
  }
}
