import { Inject, Injectable } from '@nestjs/common';
import type { InstallmentRepository } from '../../domain/repositories/InstallmentRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { InstallmentNotFoundException } from '../../domain/exceptions';
import { INSTALLMENT_REPOSITORY } from '../../Installments.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';
import { Installment } from '../../domain/entities/Installment.entity';

@Injectable()
export class UnarchiveInstallmentUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepository: InstallmentRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Installment> {
    const installment = await this.installmentRepository.findById(id);
    if (!installment) {
      throw new InstallmentNotFoundException(id);
    }

    const account = await this.accountRepository.findById(installment.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(installment.accountId);
    }

    installment.unarchive();
    return this.installmentRepository.update(installment);
  }
}
