import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import {
  AccountNotFoundException,
  AccountHasActiveChildrenException,
  AccountHasActiveDataException,
} from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import { Account } from '../../domain/entities/Account.entity';

@Injectable()
export class ArchiveAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(id);
    }

    const hasChildren = await this.accountRepository.hasActiveChildren(id);
    if (hasChildren) {
      throw new AccountHasActiveChildrenException();
    }

    const hasDebts = await this.accountRepository.hasActiveDebts(id);
    const hasInstallments = await this.accountRepository.hasActiveInstallments(id);

    if (hasDebts || hasInstallments) {
      throw new AccountHasActiveDataException();
    }

    account.archive();
    return this.accountRepository.update(account);
  }
}
