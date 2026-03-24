// Result con información del usuario
import { User } from '../../../users/domain/entities/User.entity';

export class UserResult {
  constructor(public readonly user: User) {}
}
