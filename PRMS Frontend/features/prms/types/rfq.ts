export type RFQStatus = 
  | 'DRAFT'
  | 'OPEN'
  | 'CLOSED'
  | 'UNDER_EVALUATION'
  | 'AWARDED'
  | 'CANCELLED';

export type QuotationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'EVALUATED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export interface RFQItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
  notes?: string;
}

export interface RFQInvitedSupplier {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  invitedAt: string;
  responded: boolean;
  respondedAt?: string;
}

export interface RFQAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description?: string;
  prId?: string;
  prNumber?: string;
  status: RFQStatus;
  submissionDeadline: string;
  openingDate?: string;
  validityDays: number;
  currency: string;
  evaluationCriteria?: string;
  termsAndConditions?: string;
  preparedBy: string;
  issuedBy?: string;
  issuedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  items: RFQItem[];
  invitedSuppliers: RFQInvitedSupplier[];
  attachments: RFQAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface RFQRequest {
  title: string;
  description?: string;
  prId?: string;
  submissionDeadline: string;
  validityDays?: number;
  currency?: string;
  evaluationCriteria?: string;
  termsAndConditions?: string;
  items: RFQItemRequest[];
  supplierIds: string[];
}

export interface RFQItemRequest {
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
  notes?: string;
}

export interface RFQSummary {
  id: string;
  rfqNumber: string;
  title: string;
  status: RFQStatus;
  submissionDeadline: string;
  invitedSuppliers: number;
  respondedSuppliers: number;
  estimatedValue: number;
  currency: string;
  preparedBy: string;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  rfqItemId: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  warrantyMonths?: number;
  notes?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  rfqId: string;
  rfqNumber: string;
  supplierId: string;
  supplierName: string;
  status: QuotationStatus;
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
  currency: string;
  deliveryTerms?: string;
  paymentTerms?: string;
  warrantyTerms?: string;
  notes?: string;
  submittedAt?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
  evaluationScore?: number;
  items: QuotationItem[];
  attachments: RFQAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationRequest {
  rfqId: string;
  quotationDate: string;
  validUntil: string;
  deliveryTerms?: string;
  paymentTerms?: string;
  warrantyTerms?: string;
  notes?: string;
  items: QuotationItemRequest[];
}

export interface QuotationItemRequest {
  rfqItemId: string;
  unitPrice: number;
  deliveryDays: number;
  warrantyMonths?: number;
  notes?: string;
}

export interface QuotationSummary {
  id: string;
  quotationNumber: string;
  rfqNumber: string;
  supplierName: string;
  status: QuotationStatus;
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
  currency: string;
  evaluationScore?: number;
  createdAt: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  score?: number;
  comments?: string;
}

export interface EvaluationResult {
  quotationId: string;
  evaluatorId: string;
  evaluatorName: string;
  overallScore: number;
  criteria: EvaluationCriteria[];
  comments?: string;
  recommendation?: 'ACCEPT' | 'REJECT' | 'NEGOTIATE';
  evaluationDate: string;
}

export interface RFQFilter {
  [key: string]: unknown;
  status?: RFQStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface QuotationFilter {
  [key: string]: unknown;
  status?: QuotationStatus;
  rfqId?: string;
  supplierId?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface RFQStats {
  total: number;
  open: number;
  closed: number;
  underEvaluation: number;
  awarded: number;
  averageResponseRate: number;
  averageProcessingTime: number;
}