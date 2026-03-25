import { Inject, Injectable } from '@nestjs/common';
import type { DebtRepository, DebtFilters, DebtPaginatedResult } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class ListDebtsUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(userId: number, filters: DebtFilters & { accountId?: number }): Promise<DebtPaginatedResult> {
    let accountIds: number[];

    if (filters.accountId) {
      const account = await this.accountRepository.findById(filters.accountId);
      if (!account || account.userId !== userId) {
        return { items: [], total: 0 };
      }
      accountIds = [filters.accountId];
    } else {
      const accounts = await this.accountRepository.findByUserId(userId);
      accountIds = accounts.map((a) => a.id);
    }

    if (accountIds.length === 0) {
      return { items: [], total: 0 };
    }

    return this.debtRepository.findByFilters(accountIds, filters);
  }
}
