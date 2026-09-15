export type PurchaseRequestStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FULFILLED';

export type PurchaseRequestPriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export interface PurchaseRequestItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  requiredDate: string;
  specification?: string;
  notes?: string;
}

export interface PurchaseRequestAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  title: string;
  description?: string;
  status: PurchaseRequestStatus;
  priority: PurchaseRequestPriority;
  requesterId: string;
  departmentId?: string;
  costCenterId?: string;
  budgetLineId?: string;
  requiredDate: string;
  estimatedAmount?: number;
  approvedAmount?: number;
  currency: string;
  justification?: string;
  rejectionReason?: string;
  submittedAt?: string;
  approvedAt?: string;
  items: PurchaseRequestItem[];
  attachments: PurchaseRequestAttachment[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PurchaseRequestRequest {
  title: string;
  description?: string;
  priority: PurchaseRequestPriority;
  departmentId?: string;
  costCenterId?: string;
  budgetLineId?: string;
  requiredDate: string;
  justification?: string;
  currency?: string;
  items: PurchaseRequestItemRequest[];
}

export interface PurchaseRequestItemRequest {
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  requiredDate: string;
  specification?: string;
  notes?: string;
}

export interface PurchaseRequestSummary {
  id: string;
  prNumber: string;
  title: string;
  requesterId: string;
  departmentName?: string;
  requiredDate: string;
  estimatedAmount?: number;
  status: PurchaseRequestStatus;
  priority: PurchaseRequestPriority;
  submittedAt?: string;
  createdAt: string;
}

export interface PurchaseRequestFilter {
  [key: string]: unknown;
  status?: PurchaseRequestStatus;
  priority?: PurchaseRequestPriority;
  departmentId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PurchaseRequestStats {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  averageProcessingTime: number;
}