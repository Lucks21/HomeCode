import { httpClient, type ApiResponse } from '@/shared/infrastructure';
import type { Account, AccountDetail } from '../../domain/types';
import type { AccountFormData } from '../../application/validations/account.schema';

export class AccountsHttpRepository {
  private readonly basePath = '/accounts';

  async getAll(includeArchived: boolean = false): Promise<Account[]> {
    const response = await httpClient.get<ApiResponse<Account[]>>(
      `${this.basePath}?includeArchived=${includeArchived}`,
    );
    return response.data;
  }

  async getById(id: number): Promise<AccountDetail> {
    const response = await httpClient.get<ApiResponse<AccountDetail>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: AccountFormData): Promise<Account> {
    const response = await httpClient.post<ApiResponse<Account>>(this.basePath, data);
    return response.data;
  }

  async update(id: number, data: Partial<AccountFormData>): Promise<Account> {
    const response = await httpClient.patch<ApiResponse<Account>>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async archive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/archive`, {});
  }

  async unarchive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/unarchive`, {});
  }

  async getSummary(id: number): Promise<{ income: number; expenses: number; balance: number }> {
    const response = await httpClient.get<ApiResponse<{ income: number; expenses: number; balance: number }>>(
      `${this.basePath}/${id}/summary`,
    );
    return response.data;
  }

  async getMonthlySummary(year: number, month: number): Promise<{ income: number; expenses: number; balance: number; year: number; month: number }> {
    const response = await httpClient.get<ApiResponse<{ income: number; expenses: number; balance: number; year: number; month: number }>>(
      `${this.basePath}/summary/monthly?year=${year}&month=${month}`,
    );
    return response.data;
  }
}

export const accountsRepository = new AccountsHttpRepository();
