// Caso de uso: Desactivar Usuario (RF-U1)
// El sistema debe permitir desactivar usuarios sin eliminarlos del sistema

import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/User.entity';
import type { UserRepository } from '../../domain/repositories/UserRepository.interface';
import { UserNotFoundException, SelfDeactivationException } from '../../domain/exceptions';
import { USER_REPOSITORY } from '../../Users.Tokens';

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, deactivatedBy: number): Promise<User> {
    // Validar que no se desactive a sí mismo
    if (userId === deactivatedBy) {
      throw new SelfDeactivationException();
    }

    // Buscar usuario
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    // Desactivar usuario (la entidad valida si ya está inactivo)
    user.deactivate();

    // Persistir cambios
    const updatedUser = await this.userRepository.update(user);

    return updatedUser;
  }
}
