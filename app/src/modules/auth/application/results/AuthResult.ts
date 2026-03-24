// Result del use case de autenticación
import { User } from '../../../users/domain/entities/User.entity';

export class AuthResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: User,
    public readonly expiresIn: number,
  ) {}
}
