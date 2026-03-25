import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/Transaction.entity';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { TransactionFilters } from '../../domain/repositories/TransactionRepository.interface';
import { TRANSACTION_REPOSITORY } from '../../Transactions.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

export interface ListTransactionsFilters {
  accountId?: number;
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  perPage?: number;
  includeArchived?: boolean;
}

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    userId: number,
    filters: ListTransactionsFilters,
  ): Promise<{ items: Transaction[]; total: number; page: number; perPage: number }> {
    const userAccounts = await this.accountRepository.findByUserId(userId, false);
    let accountIds = userAccounts.map((a) => a.id);

    if (filters.accountId) {
      if (!accountIds.includes(filters.accountId)) {
        return { items: [], total: 0, page: filters.page || 1, perPage: filters.perPage || 20 };
      }
      accountIds = [filters.accountId];
    }

    if (accountIds.length === 0) {
      return { items: [], total: 0, page: filters.page || 1, perPage: filters.perPage || 20 };
    }

    const repoFilters: TransactionFilters = {
      type: filters.type,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: filters.page,
      perPage: filters.perPage,
      includeArchived: filters.includeArchived,
    };

    const result = await this.transactionRepository.findByFilters(accountIds, repoFilters);

    return {
      items: result.items,
      total: result.total,
      page: filters.page || 1,
      perPage: filters.perPage || 20,
    };
  }
}
