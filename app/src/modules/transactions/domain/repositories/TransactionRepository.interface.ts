import { Transaction } from '../entities/Transaction.entity';

export interface TransactionFilters {
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  perPage?: number;
}

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: number): Promise<Transaction | null>;
  update(transaction: Transaction): Promise<Transaction>;
  findByFilters(
    accountIds: number[],
    filters: TransactionFilters,
  ): Promise<{ items: Transaction[]; total: number }>;
}
