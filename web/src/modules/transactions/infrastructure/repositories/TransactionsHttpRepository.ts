import { httpClient, type ApiResponse } from '@/shared/infrastructure';
import type { Transaction, TransactionFilters } from '../../domain/types';
import type { TransactionFormData } from '../../application/validations/transaction.schema';

export class TransactionsHttpRepository {
  private readonly basePath = '/transactions';

  async getAll(filters?: Partial<TransactionFilters>): Promise<Transaction[]> {
    const params = new URLSearchParams();

    if (filters?.accountId) {
      params.append('accountId', filters.accountId.toString());
    }
    if (filters?.type && filters.type !== 'TODOS') {
      params.append('type', filters.type);
    }
    if (filters?.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append('dateTo', filters.dateTo);
    }

    const query = params.toString();
    const url = query ? `${this.basePath}?${query}` : this.basePath;

    const response = await httpClient.get<ApiResponse<Transaction[]>>(url);
    return response.data;
  }

  async create(data: TransactionFormData): Promise<Transaction> {
    const response = await httpClient.post<ApiResponse<Transaction>>(this.basePath, data);
    return response.data;
  }

  async update(id: number, data: Partial<TransactionFormData>): Promise<Transaction> {
    const response = await httpClient.patch<ApiResponse<Transaction>>(
      `${this.basePath}/${id}`,
      data,
    );
    return response.data;
  }

  async archive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/archive`, {});
  }
}

export const transactionsRepository = new TransactionsHttpRepository();
