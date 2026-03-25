import { Inject, Injectable } from '@nestjs/common';
import type { InstallmentRepository } from '../../domain/repositories/InstallmentRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { PayInstallmentsCommand } from '../commands/PayInstallmentsCommand';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { InstallmentNotFoundException, TooManyInstallmentsToPayException } from '../../domain/exceptions';
import { INSTALLMENT_REPOSITORY } from '../../Installments.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';
import { Installment } from '../../domain/entities/Installment.entity';

@Injectable()
export class PayInstallmentsUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepository: InstallmentRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: PayInstallmentsCommand, userId: number): Promise<Installment> {
    const installment = await this.installmentRepository.findById(command.installmentId);
    if (!installment) {
      throw new InstallmentNotFoundException(command.installmentId);
    }

    const account = await this.accountRepository.findById(installment.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(installment.accountId);
    }

    const unpaidPayments = installment.payments
      .filter((p) => !p.paid)
      .sort((a, b) => a.installmentNumber - b.installmentNumber);

    if (command.count > unpaidPayments.length) {
      throw new TooManyInstallmentsToPayException();
    }

    const paymentsToPay = unpaidPayments.slice(0, command.count);
    const paymentIds = paymentsToPay.map((p) => p.id);
    const paidDate = new Date();

    await this.installmentRepository.markPaymentsAsPaid(paymentIds, paidDate);

    const updated = await this.installmentRepository.findById(command.installmentId);
    return updated!;
  }
}
