import { apiClient, type ApiError } from '@/lib/api';
export { apiClient, handleApiError, isApiError } from '@/lib/api';
export type { ApiError };

export type BackendPRStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PO_CREATED';
export type BackendPOStatus = 'DRAFT' | 'SENT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';
export type BackendPaymentTerms = 'NET_15' | 'NET_30' | 'NET_60' | 'COD';
export type BackendVendorType = 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT';
export type BackendApprovalAction = 'APPROVE' | 'REJECT' | 'RETURN';

export interface VendorResponse {
  id: number;
  vendorCode: string;
  name: string;
  vendorType: BackendVendorType;
  taxIdentificationNumber: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: BackendPaymentTerms;
  blacklisted: boolean;
  performanceScore: number | null;
}

export interface RequisitionResponse {
  id: number;
  requisitionNumber: string;
  requesterEmployeeId: string;
  departmentCode: string;
  purpose: string;
  itemDetails: string;
  estimatedAmount: number;
  status: BackendPRStatus;
  requiredByDate: string;
  approvalWorkflowId: number | null;
  createdAt: string;
}

export interface PurchaseOrderResponse {
  id: number;
  purchaseOrderNumber: string;
  purchaseRequisitionId: number;
  vendorId: number;
  vendorName: string;
  itemDetails: string;
  totalAmount: number;
  paymentTerms: BackendPaymentTerms;
  status: BackendPOStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  expiryDate: string | null;
  createdAt?: string;
}

export interface RFQResponse {
  id: number;
  rfqNumber: string;
  title: string;
  itemDetails: string;
  submissionDeadline: string;
  active: boolean;
  purchaseRequisitionId: number;
  requisitionNumber: string | null;
  createdAt: string;
}

export interface GoodsReceiptResponse {
  id: number;
  receiptNumber: string;
  purchaseOrderId: number;
  purchaseOrderNumber: string;
  vendorName: string;
  receiptDate: string;
  receivedByEmployeeId: string;
  receiptDetails: string;
  inspectionNotes: string | null;
  accepted: boolean;
  createdAt: string;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  purchaseOrderId: number;
  purchaseOrderNumber: string;
  vendorId: number;
  vendorName: string;
  invoiceAmount: number;
  invoiceDate: string;
  dueDate: string;
  processingStatus: string;
  itemDetails: string | null;
  financeReference: string | null;
  createdAt: string;
}

export interface ContractResponse {
  id: number;
  contractNumber: string;
  vendorId: number;
  vendorName: string;
  purchaseOrderId: number | null;
  contractValue: number;
  startDate: string;
  endDate: string;
  termsAndConditions: string;
  createdAt: string;
}

export interface QuotationResponse {
  id: number;
  quotationNumber: string;
  rfqId: number;
  rfqNumber: string;
  vendorId: number;
  vendorName: string;
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
  selected: boolean;
  createdAt: string;
}

export interface RequisitionCreateRequest {
  requesterEmployeeId: string;
  departmentCode: string;
  purpose: string;
  itemDetails: string;
  estimatedAmount: number;
  requiredByDate: string;
}

export interface RequisitionApproveRequest {
  action: BackendApprovalAction;
  comments?: string;
}

export interface VendorCreateRequest {
  vendorCode: string;
  name: string;
  vendorType: BackendVendorType;
  taxIdentificationNumber: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: BackendPaymentTerms;
}

export interface RFQCreateRequest {
  title: string;
  itemDetails: string;
  submissionDeadline: string;
  purchaseRequisitionId: number;
}

export interface PurchaseOrderCreateRequest {
  purchaseRequisitionId: number;
  vendorId: number;
  itemDetails: string;
  totalAmount: number;
  paymentTerms: BackendPaymentTerms;
  expectedDeliveryDate: string;
  expiryDate?: string;
}

export interface GoodsReceiptRequest {
  purchaseOrderId: number;
  receiptDate: string;
  receivedByEmployeeId: string;
  receiptDetails: string;
  inspectionNotes?: string;
  accepted: boolean;
}

export interface InvoiceRequest {
  invoiceNumber: string;
  purchaseOrderId: number;
  vendorId: number;
  invoiceAmount: number;
  invoiceDate: string;
  dueDate: string;
  itemDetails?: string;
}

export interface ContractCreateRequest {
  vendorId: number;
  purchaseOrderId: number;
  contractValue: number;
  startDate: string;
  endDate: string;
  termsAndConditions: string;
}

export interface QuotationCreateRequest {
  rfqId: number;
  vendorId: number;
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
}

export const vendorApi = {
  list: (): Promise<VendorResponse[]> =>
    apiClient.get<any>('/vendors').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<VendorResponse> =>
    apiClient.get<any>(`/vendors/${id}`).then((r) => r.data?.data || r.data),
  create: (body: VendorCreateRequest): Promise<VendorResponse> =>
    apiClient.post<VendorResponse>('/vendors', body).then((r) => r.data),
};

export const requisitionApi = {
  list: (): Promise<RequisitionResponse[]> =>
    apiClient.get<any>('/requisitions').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  listByRequester: (requesterEmployeeId: string): Promise<RequisitionResponse[]> =>
    apiClient.get<any>(`/requisitions${requesterEmployeeId ? `?requesterEmployeeId=${encodeURIComponent(requesterEmployeeId)}` : ''}`).then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<RequisitionResponse> =>
    apiClient.get<any>(`/requisitions/${id}`).then((r) => r.data?.data || r.data),
  create: (body: RequisitionCreateRequest): Promise<RequisitionResponse> =>
    apiClient.post<RequisitionResponse>('/requisitions', body).then((r) => r.data),
  submit: (id: number | string): Promise<RequisitionResponse> =>
    apiClient.post<RequisitionResponse>(`/requisitions/${id}/submit`).then((r) => r.data),
};

export const approvalApi = {
  listPending: (): Promise<RequisitionResponse[]> =>
    apiClient.get<any>('/approvals/pending').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  decideOnRequisition: async (
    requisitionId: number | string,
    body: RequisitionApproveRequest
  ): Promise<RequisitionResponse> => {
    const r = await apiClient.post<any>(`/approvals/requisitions/${requisitionId}`, body);
    return r.data?.data || r.data;
  },
};

export const rfqApi = {
  list: (): Promise<RFQResponse[]> =>
    apiClient.get<any>('/rfqs').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<RFQResponse> =>
    apiClient.get<any>(`/rfqs/${id}`).then((r) => r.data?.data || r.data),
  create: (body: RFQCreateRequest): Promise<RFQResponse> =>
    apiClient.post<RFQResponse>('/rfqs', body).then((r) => r.data),
};

export const purchaseOrderApi = {
  list: (): Promise<PurchaseOrderResponse[]> =>
    apiClient.get<any>('/purchase-orders').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<PurchaseOrderResponse> =>
    apiClient.get<any>(`/purchase-orders/${id}`).then((r) => r.data?.data || r.data),
  create: (body: PurchaseOrderCreateRequest): Promise<PurchaseOrderResponse> =>
    apiClient.post<PurchaseOrderResponse>('/purchase-orders', body).then((r) => r.data),
};

export const goodsReceiptApi = {
  list: (): Promise<GoodsReceiptResponse[]> =>
    apiClient.get<any>('/goods-receipts').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<GoodsReceiptResponse> =>
    apiClient.get<any>(`/goods-receipts/${id}`).then((r) => r.data?.data || r.data),
  create: (body: GoodsReceiptRequest): Promise<GoodsReceiptResponse> =>
    apiClient.post<any>('/goods-receipts', body).then((r) => r.data?.data || r.data),
};

export const invoiceApi = {
  list: (): Promise<InvoiceResponse[]> =>
    apiClient.get<any>('/invoices').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<InvoiceResponse> =>
    apiClient.get<any>(`/invoices/${id}`).then((r) => r.data?.data || r.data),
  create: (body: InvoiceRequest): Promise<InvoiceResponse> =>
    apiClient.post<any>('/invoices', body).then((r) => r.data?.data || r.data),
  submit: (body: InvoiceRequest): Promise<InvoiceResponse> =>
    apiClient.post<any>('/invoices', body).then((r) => r.data?.data || r.data),
};

export const quotationApi = {
  list: (rfqId?: number | string): Promise<QuotationResponse[]> =>
    apiClient.get<any>(`/quotations${rfqId ? `?rfqId=${rfqId}` : ''}`).then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<QuotationResponse> =>
    apiClient.get<any>(`/quotations/${id}`).then((r) => r.data?.data || r.data),
  create: (body: QuotationCreateRequest): Promise<QuotationResponse> =>
    apiClient.post<any>('/quotations', body).then((r) => r.data?.data || r.data),
  select: (id: number | string): Promise<QuotationResponse> =>
    apiClient.post<any>(`/quotations/${id}/select`).then((r) => r.data?.data || r.data),
};

export const contractApi = {
  list: (): Promise<ContractResponse[]> =>
    apiClient.get<any>('/contracts').then((r) => {
      const d = r.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.content)) return d.content;
      return [];
    }),
  getById: (id: number | string): Promise<ContractResponse> =>
    apiClient.get<any>(`/contracts/${id}`).then((r) => r.data?.data || r.data),
  create: (body: ContractCreateRequest): Promise<ContractResponse> =>
    apiClient.post<any>('/contracts', body).then((r) => r.data?.data || r.data),
};

export const dashboardApi = {
  getStats: (): Promise<any> =>
    apiClient.get<any>('/dashboard/stats').then((r) => r.data?.data || r.data),
};

export const prStatusBadge = (status: BackendPRStatus): string => {
  switch (status) {
    case 'APPROVED': return 'bg-[#1e50c8]/10 text-[#1e50c8] border-[#1e50c8]/20';
    case 'PENDING_APPROVAL': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'REJECTED': return 'bg-[#c1121f]/10 text-[#c1121f] border-[#c1121f]/20';
    case 'PO_CREATED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

export const prStatusLabel = (status: BackendPRStatus): string => {
  switch (status) {
    case 'APPROVED': return 'Approved';
    case 'PENDING_APPROVAL': return 'Pending Approval';
    case 'REJECTED': return 'Rejected';
    case 'PO_CREATED': return 'PO Issued';
    default: return 'Draft';
  }
};

export const poStatusBadge = (status: BackendPOStatus): string => {
  switch (status) {
    case 'CONFIRMED': return 'bg-[#1e50c8]/10 text-[#1e50c8] border-[#1e50c8]/20';
    case 'COMPLETED': return 'bg-[#1e50c8]/10 text-[#1e50c8] border-[#1e50c8]/20';
    case 'SENT': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'PARTIALLY_RECEIVED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'CANCELLED': return 'bg-[#c1121f]/10 text-[#c1121f] border-[#c1121f]/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};
