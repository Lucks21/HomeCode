import { Installment } from '../entities/Installment.entity';
import { InstallmentPayment } from '../entities/InstallmentPayment.entity';

export interface InstallmentFilters {
  page?: number;
  perPage?: number;
  includeArchived?: boolean;
}

export interface InstallmentRepository {
  create(installment: Installment): Promise<Installment>;
  findById(id: number): Promise<Installment | null>;
  update(installment: Installment): Promise<Installment>;
  createPayments(payments: InstallmentPayment[]): Promise<void>;
  markPaymentsAsPaid(paymentIds: number[], paidDate: Date): Promise<void>;
  findByFilters(
    accountIds: number[],
    filters: InstallmentFilters,
  ): Promise<{ items: Installment[]; total: number }>;
}
