export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: number;
  accountId: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  archived: boolean;
  createdAt: string;
}

export interface TransactionFilters {
  accountId: number | null;
  type: 'TODOS' | 'INCOME' | 'EXPENSE';
  dateFrom: string;
  dateTo: string;
  includeArchived?: boolean;
}
