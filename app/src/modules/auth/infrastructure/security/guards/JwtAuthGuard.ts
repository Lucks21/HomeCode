// Guard de autenticación JWT
// Protege rutas requiriendo un token JWT válido

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
