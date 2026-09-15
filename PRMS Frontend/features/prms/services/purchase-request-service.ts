import { apiClient, type ApiResponse } from '@/lib/api';
import type {
  PurchaseRequest,
  PurchaseRequestRequest,
  PurchaseRequestSummary,
  PurchaseRequestFilter,
  PurchaseRequestStats,
} from '@/features/prms/types/purchase-request';

export class PurchaseRequestService {
  private basePath = '/requisitions';

  async getPurchaseRequests(filter?: PurchaseRequestFilter): Promise<ApiResponse<PurchaseRequestSummary[]>> {
    return apiClient.get<PurchaseRequestSummary[]>(this.basePath, filter);
  }

  async getPurchaseRequest(id: string): Promise<ApiResponse<PurchaseRequest>> {
    return apiClient.get<PurchaseRequest>(`${this.basePath}/${id}`);
  }

  async createPurchaseRequest(data: PurchaseRequestRequest): Promise<ApiResponse<PurchaseRequest>> {
    return apiClient.post<PurchaseRequest>(this.basePath, data);
  }

  async updatePurchaseRequest(id: string, data: Partial<PurchaseRequestRequest>): Promise<ApiResponse<PurchaseRequest>> {
    return apiClient.put<PurchaseRequest>(`${this.basePath}/${id}`, data);
  }

  async deletePurchaseRequest(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async submitPurchaseRequest(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/submit`);
  }

  async getPurchaseRequestStats(): Promise<ApiResponse<PurchaseRequestStats>> {
    return apiClient.get<PurchaseRequestStats>(`${this.basePath}/stats`);
  }
}

export const purchaseRequestService = new PurchaseRequestService();
