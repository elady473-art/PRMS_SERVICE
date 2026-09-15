export type InvoiceStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SENT'
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'DISPUTED'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface InvoiceItem {
  id: string;
  poItemId: string;
  grnItemId?: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  netAmount: number;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber?: string;
  poId: string;
  poNumber: string;
  grnId?: string;
  grnNumber?: string;
  supplierId: string;
  supplierName: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  receivedDate?: string;
  approvedDate?: string;
  paidDate?: string;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  currency: string;
  paymentTerms?: string;
  notes?: string;
  rejectionReason?: string;
  items: InvoiceItem[];
  attachments: InvoiceAttachment[];
  paymentHistory: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PaymentRecord {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface InvoiceRequest {
  poId: string;
  grnId?: string;
  invoiceDate: string;
  dueDate: string;
  supplierInvoiceNumber?: string;
  paymentTerms?: string;
  notes?: string;
  items: InvoiceItemRequest[];
}

export interface InvoiceItemRequest {
  poItemId: string;
  grnItemId?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discountRate?: number;
  notes?: string;
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber?: string;
  poNumber: string;
  supplierName: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  daysOverdue?: number;
  createdAt: string;
}

export interface InvoiceFilter {
  status?: InvoiceStatus;
  paymentStatus?: PaymentStatus;
  poId?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface InvoiceStats {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  overdue: number;
  totalValue: number;
  paidValue: number;
  overdueValue: number;
  averagePaymentTime: number;
}