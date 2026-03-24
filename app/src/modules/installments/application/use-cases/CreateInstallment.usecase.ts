import { Inject, Injectable } from '@nestjs/common';
import { Installment } from '../../domain/entities/Installment.entity';
import { InstallmentPayment } from '../../domain/entities/InstallmentPayment.entity';
import type { InstallmentRepository } from '../../domain/repositories/InstallmentRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { CreateInstallmentCommand } from '../commands/CreateInstallmentCommand';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { InvalidInstallmentDataException } from '../../domain/exceptions';
import { INSTALLMENT_REPOSITORY } from '../../Installments.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class CreateInstallmentUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepository: InstallmentRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: CreateInstallmentCommand, userId: number): Promise<Installment> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(command.accountId);
    }

    if (!command.description || command.description.trim().length === 0) {
      throw new InvalidInstallmentDataException('La descripción es requerida');
    }

    if (command.totalAmount <= 0) {
      throw new InvalidInstallmentDataException('El monto total debe ser mayor a 0');
    }

    if (command.totalInstallments <= 0) {
      throw new InvalidInstallmentDataException('El número de cuotas debe ser mayor a 0');
    }

    const installmentValue = command.installmentValue ?? Math.ceil(command.totalAmount / command.totalInstallments);

    if (command.installmentValue !== undefined && command.installmentValue !== null) {
      if (command.installmentValue * command.totalInstallments < command.totalAmount) {
        throw new InvalidInstallmentDataException(
          'El valor de cuota multiplicado por el número de cuotas debe ser mayor o igual al monto total',
        );
      }
    }

    const installment = Installment.create(
      0,
      command.accountId,
      command.description.trim(),
      command.totalAmount,
      command.totalInstallments,
      installmentValue,
      new Date(command.startDate),
    );

    const created = await this.installmentRepository.create(installment);

    const payments: InstallmentPayment[] = [];
    for (let i = 1; i <= command.totalInstallments; i++) {
      payments.push(
        InstallmentPayment.create(0, created.id, i, installmentValue, false, null),
      );
    }

    await this.installmentRepository.createPayments(payments);

    const result = await this.installmentRepository.findById(created.id);
    return result!;
  }
}
