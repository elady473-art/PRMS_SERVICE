import { apiClient, type ApiResponse } from '@/lib/api';
import type { RFQ, RFQRequest, RFQSummary, Quotation, QuotationRequest, QuotationSummary } from '@/features/prms/types/rfq';

export class RFQService {
  private basePath = '/rfqs';

  async getRFQs(filter?: Record<string, unknown>): Promise<ApiResponse<RFQSummary[]>> {
    return apiClient.get<RFQSummary[]>(this.basePath, filter);
  }

  async getRFQ(id: string): Promise<ApiResponse<RFQ>> {
    return apiClient.get<RFQ>(`${this.basePath}/${id}`);
  }

  async createRFQ(data: RFQRequest): Promise<ApiResponse<RFQ>> {
    return apiClient.post<RFQ>(this.basePath, data);
  }

  async updateRFQ(id: string, data: Partial<RFQRequest>): Promise<ApiResponse<RFQ>> {
    return apiClient.put<RFQ>(`${this.basePath}/${id}`, data);
  }

  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async publishRFQ(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/publish`);
  }

  async closeRFQ(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/close`);
  }
}

export class QuotationService {
  private basePath = '/quotations';

  async getQuotations(filter?: Record<string, unknown>): Promise<ApiResponse<QuotationSummary[]>> {
    return apiClient.get<QuotationSummary[]>(this.basePath, filter);
  }

  async getQuotation(id: string): Promise<ApiResponse<Quotation>> {
    return apiClient.get<Quotation>(`${this.basePath}/${id}`);
  }

  async createQuotation(data: QuotationRequest): Promise<ApiResponse<Quotation>> {
    return apiClient.post<Quotation>(this.basePath, data);
  }

  async submitQuotation(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/submit`);
  }

  async acceptQuotation(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/accept`);
  }

  async rejectQuotation(id: string, reason: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.basePath}/${id}/reject`, { reason });
  }

  async getQuotationsByRFQ(rfqId: string): Promise<ApiResponse<QuotationSummary[]>> {
    return apiClient.get<QuotationSummary[]>(`${this.basePath}?rfqId=${rfqId}`);
  }
}

export const rfqService = new RFQService();
export const quotationService = new QuotationService();
