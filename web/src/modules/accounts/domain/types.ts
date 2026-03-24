export type AccountType = 'MAIN' | 'DEBT' | 'INSTALLMENT';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  parentId: number | null;
  userId: number;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  children?: Account[];
}

export interface AccountDetail extends Account {
  children: Account[];
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export interface AccountFilters {
  search: string;
  type: 'TODOS' | 'MAIN' | 'DEBT' | 'INSTALLMENT';
  includeArchived: boolean;
}
