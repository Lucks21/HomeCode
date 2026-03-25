import { Debt } from '../entities/Debt.entity';
import { DebtPayment } from '../entities/DebtPayment.entity';

export interface DebtFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
  includeArchived?: boolean;
}

export interface DebtPaginatedResult {
  items: Debt[];
  total: number;
}

export interface DebtRepository {
  create(debt: Debt): Promise<Debt>;
  findById(id: number): Promise<Debt | null>;
  update(debt: Debt): Promise<Debt>;
  addPayment(debtId: number, amount: number, date: Date): Promise<DebtPayment>;
  findPaymentsByDebtId(debtId: number): Promise<DebtPayment[]>;
  findByFilters(accountIds: number[], filters: DebtFilters): Promise<DebtPaginatedResult>;
}
