import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { AccountNotFoundException } from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';

@Injectable()
export class GetAccountSummaryUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    accountId: number,
    userId: number,
  ): Promise<{ income: number; expenses: number; balance: number }> {
    const account = await this.accountRepository.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(accountId);
    }

    return this.accountRepository.getFinancialSummary(accountId);
  }
}
