import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { AccountNotFoundException } from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import { Account } from '../../domain/entities/Account.entity';

export interface AccountDetailResult {
  account: Account;
  children: Account[];
  summary: { income: number; expenses: number; balance: number };
}

@Injectable()
export class GetAccountDetailUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<AccountDetailResult> {
    const account = await this.accountRepository.findById(id);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(id);
    }

    const children = await this.accountRepository.findChildrenByParentId(id);
    const summary = await this.accountRepository.getFinancialSummary(id);

    return { account, children, summary };
  }
}
