import { httpClient, type ApiResponse } from '@/shared/infrastructure';
import type { Debt, DebtFilters } from '../../domain/types';
import type { DebtFormData } from '../../application/validations/debt.schema';
import type { DebtPaymentFormData } from '../../application/validations/debtPayment.schema';

export class DebtsHttpRepository {
  private readonly basePath = '/debts';

  async getAll(filters?: Partial<DebtFilters>): Promise<Debt[]> {
    const params = new URLSearchParams();

    if (filters?.accountId) {
      params.append('accountId', filters.accountId.toString());
    }
    if (filters?.status && filters.status !== 'TODOS') {
      params.append('status', filters.status);
    }
    if (filters?.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append('dateTo', filters.dateTo);
    }

    const query = params.toString();
    const url = query ? `${this.basePath}?${query}` : this.basePath;

    const response = await httpClient.get<ApiResponse<Debt[]>>(url);
    return response.data;
  }

  async getById(id: number): Promise<Debt> {
    const response = await httpClient.get<ApiResponse<Debt>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: DebtFormData): Promise<Debt> {
    const response = await httpClient.post<ApiResponse<Debt>>(this.basePath, data);
    return response.data;
  }

  async registerPayment(debtId: number, data: DebtPaymentFormData): Promise<void> {
    await httpClient.post<ApiResponse<void>>(`${this.basePath}/${debtId}/payments`, data);
  }

  async archive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/archive`, {});
  }
}

export const debtsRepository = new DebtsHttpRepository();
