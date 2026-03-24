import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { AccountNotFoundException } from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import { Account } from '../../domain/entities/Account.entity';

@Injectable()
export class UnarchiveAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(id);
    }

    account.unarchive();
    return this.accountRepository.update(account);
  }
}
