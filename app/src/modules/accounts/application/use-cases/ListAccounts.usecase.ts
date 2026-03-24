import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import { Account } from '../../domain/entities/Account.entity';

@Injectable()
export class ListAccountsUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(userId: number, includeArchived: boolean = false): Promise<Account[]> {
    return this.accountRepository.findByUserId(userId, includeArchived);
  }
}
