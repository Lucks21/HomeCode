export type DebtStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface DebtPayment {
  id: number;
  debtId: number;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Debt {
  id: number;
  accountId: number;
  description: string;
  amount: number;
  remainingAmount: number;
  status: DebtStatus;
  date: string;
  archived: boolean;
  createdAt: string;
  payments?: DebtPayment[];
}

export interface DebtFilters {
  accountId: number | null;
  status: 'TODOS' | 'PENDING' | 'PARTIAL' | 'PAID';
  dateFrom: string;
  dateTo: string;
}
