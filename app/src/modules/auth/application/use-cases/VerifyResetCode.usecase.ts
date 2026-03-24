// Caso de uso: Verificar código de restablecimiento
// Valida que el código sea correcto, no haya expirado y no esté usado

import { UserRepository } from '../../../users/domain/repositories/UserRepository.interface';
import { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository.interface';
import { VerifyResetCodeCommand } from '../commands/VerifyResetCodeCommand';
import { VerifyResetCodeResult } from '../results/VerifyResetCodeResult';

export class VerifyResetCodeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  async execute(command: VerifyResetCodeCommand): Promise<VerifyResetCodeResult> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      return new VerifyResetCodeResult(false, 'Código inválido o expirado');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive()) {
      return new VerifyResetCodeResult(false, 'Usuario inactivo');
    }

    // Buscar código de restablecimiento
    const resetCode = await this.passwordResetRepository.findByUserAndCode(user.id, command.code);

    if (!resetCode) {
      return new VerifyResetCodeResult(false, 'Código inválido o expirado');
    }

    // Validar que el código sea válido (no usado y no expirado)
    if (!resetCode.isValid()) {
      if (resetCode.used) {
        return new VerifyResetCodeResult(false, 'Código ya utilizado');
      }
      if (resetCode.isExpired()) {
        return new VerifyResetCodeResult(false, 'Código expirado');
      }
      return new VerifyResetCodeResult(false, 'Código inválido');
    }

    // Código válido
    return new VerifyResetCodeResult(true);
  }
}
