import { apiClient, type ApiResponse } from '@/lib/api';
import type {
  Supplier,
  SupplierRequest,
  SupplierSummary,
  SupplierFilter,
} from '@/features/prms/types/supplier';

export class SupplierService {
  private basePath = '/vendors';

  async getSuppliers(filter?: SupplierFilter): Promise<ApiResponse<SupplierSummary[]>> {
    return apiClient.get<SupplierSummary[]>(this.basePath, filter);
  }

  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return apiClient.get<Supplier>(`${this.basePath}/${id}`);
  }

  async createSupplier(data: SupplierRequest): Promise<ApiResponse<Supplier>> {
    return apiClient.post<Supplier>(this.basePath, data);
  }

  async updateSupplier(id: string, data: Partial<SupplierRequest>): Promise<ApiResponse<Supplier>> {
    return apiClient.put<Supplier>(`${this.basePath}/${id}`, data);
  }

  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async getSupplierPerformance(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<Record<string, unknown>>(`${this.basePath}/${id}/performance`);
  }

  async activateSupplier(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/activate`);
  }

  async deactivateSupplier(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/deactivate`);
  }

  async uploadSupplierDocument(id: string, file: File, documentType: string): Promise<ApiResponse<unknown>> {
    return apiClient.post<unknown>(`${this.basePath}/${id}/documents`, { documentType });
  }
}

export const supplierService = new SupplierService();
