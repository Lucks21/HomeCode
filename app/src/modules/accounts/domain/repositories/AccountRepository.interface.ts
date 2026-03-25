import { Account } from '../entities/Account.entity';

export interface AccountRepository {
  create(account: Account): Promise<Account>;
  findById(id: number): Promise<Account | null>;
  findByUserId(userId: number, includeArchived?: boolean): Promise<Account[]>;
  findChildrenByParentId(parentId: number): Promise<Account[]>;
  update(account: Account): Promise<Account>;
  hasActiveChildren(accountId: number): Promise<boolean>;
  hasActiveTransactions(accountId: number): Promise<boolean>;
  hasActiveDebts(accountId: number): Promise<boolean>;
  hasActiveInstallments(accountId: number): Promise<boolean>;
  hasAssociatedData(accountId: number): Promise<boolean>;
  getFinancialSummary(accountId: number): Promise<{ income: number; expenses: number; balance: number }>;
  isDescendantOf(accountId: number, potentialAncestorId: number): Promise<boolean>;
}
