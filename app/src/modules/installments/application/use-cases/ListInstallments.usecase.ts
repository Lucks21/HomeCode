import { Inject, Injectable } from '@nestjs/common';
import type { InstallmentRepository, InstallmentFilters } from '../../domain/repositories/InstallmentRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { INSTALLMENT_REPOSITORY } from '../../Installments.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';
import { Installment } from '../../domain/entities/Installment.entity';

@Injectable()
export class ListInstallmentsUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepository: InstallmentRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    userId: number,
    filters: InstallmentFilters,
  ): Promise<{ items: Installment[]; total: number }> {
    const accounts = await this.accountRepository.findByUserId(userId);
    const accountIds = accounts.map((a) => a.id);

    if (accountIds.length === 0) {
      return { items: [], total: 0 };
    }

    return this.installmentRepository.findByFilters(accountIds, filters);
  }
}
