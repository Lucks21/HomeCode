import { httpClient, type ApiResponse } from '@/shared/infrastructure';
import type { Installment } from '../../domain/types';
import type { InstallmentFormData } from '../../application/validations/installment.schema';

export class InstallmentsHttpRepository {
  private readonly basePath = '/installments';

  async getAll(filters?: { includeArchived?: boolean }): Promise<Installment[]> {
    const params = new URLSearchParams();
    if (filters?.includeArchived) {
      params.append('includeArchived', 'true');
    }
    const query = params.toString();
    const url = query ? `${this.basePath}?${query}` : this.basePath;
    const response = await httpClient.get<ApiResponse<Installment[]>>(url);
    return response.data;
  }

  async getById(id: number): Promise<Installment> {
    const response = await httpClient.get<ApiResponse<Installment>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: InstallmentFormData): Promise<Installment> {
    const response = await httpClient.post<ApiResponse<Installment>>(this.basePath, data);
    return response.data;
  }

  async payInstallments(id: number, count: number): Promise<void> {
    await httpClient.post<ApiResponse<void>>(`${this.basePath}/${id}/pay`, { count });
  }

  async archive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/archive`, {});
  }

  async unarchive(id: number): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(`${this.basePath}/${id}/unarchive`, {});
  }
}

export const installmentsRepository = new InstallmentsHttpRepository();
