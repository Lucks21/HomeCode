import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/Transaction.entity';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { TransactionNotFoundException } from '../../domain/exceptions';
import { TRANSACTION_REPOSITORY } from '../../Transactions.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class ArchiveTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new TransactionNotFoundException(id);
    }

    const account = await this.accountRepository.findById(transaction.accountId);
    if (!account || account.userId !== userId) {
      throw new TransactionNotFoundException(id);
    }

    transaction.archive();
    return this.transactionRepository.update(transaction);
  }
}
