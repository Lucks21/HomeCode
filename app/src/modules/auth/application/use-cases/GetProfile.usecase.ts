// Caso de uso: Obtener perfil del usuario autenticado
import { UserRepository } from '../../../users/domain/repositories/UserRepository.interface';
import { GetProfileCommand } from '../commands/GetProfileCommand';
import { UserResult } from '../results/UserResult';
import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: GetProfileCommand): Promise<UserResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return new UserResult(user);
  }
}
