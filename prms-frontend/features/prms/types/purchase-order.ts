export type PurchaseOrderStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'PARTIALLY_INVOICED'
  | 'INVOICED'
  | 'PAID'
  | 'CLOSED'
  | 'CANCELLED';

export type PaymentTerm = 
  | 'NET_30'
  | 'NET_60'
  | 'NET_90'
  | 'UPON_DELIVERY'
  | 'ADVANCE_PARTIAL'
  | 'ADVANCE_FULL';

export type DeliveryStatus = 
  | 'NOT_STARTED'
  | 'SCHEDULED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'DELAYED'
  | 'CANCELLED';

export type InvoiceStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveredQuantity: number;
  invoicedQuantity: number;
  receivedQuantity: number;
  deliveryDate?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quotationId?: string;
  quotationNumber?: string;
  rfqId?: string;
  rfqNumber?: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  supplierEmail: string;
  supplierAddress: string;
  status: PurchaseOrderStatus;
  issueDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  currency: string;
  paymentTerms: PaymentTerm;
  paymentTermsDescription?: string;
  deliveryTerms?: string;
  warrantyTerms?: string;
  notes?: string;
  preparedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  items: PurchaseOrderItem[];
  attachments: PurchaseOrderAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PurchaseOrderRequest {
  quotationId: string;
  issueDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  paymentTerms: PaymentTerm;
  paymentTermsDescription?: string;
  deliveryTerms?: string;
  warrantyTerms?: string;
  notes?: string;
}

export interface PurchaseOrderSummary {
  id: string;
  poNumber: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  issueDate: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
  deliveredPercentage: number;
  invoicedPercentage: number;
  preparedBy: string;
  createdAt: string;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  warehouseLocation: string;
  carrierName?: string;
  trackingNumber?: string;
  notes?: string;
  items: GrnItem[];
  attachments: PurchaseOrderAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface GrnItem {
  id: string;
  poItemId: string;
  itemCode: string;
  description: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'PARTIAL';
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
  currency: string;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentTerms?: string;
  notes?: string;
  items: InvoiceItem[];
  attachments: PurchaseOrderAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  poItemId: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveredQuantity: number;
  notes?: string;
}

export interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus;
  supplierId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface GoodsReceiptFilter {
  poId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface InvoiceFilter {
  status?: InvoiceStatus;
  poId?: string;
  supplierId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PurchaseOrderStats {
  total: number;
  issued: number;
  inProgress: number;
  delivered: number;
  invoiced: number;
  closed: number;
  totalValue: number;
  pendingDeliveryValue: number;
  pendingInvoiceValue: number;
  averageProcessingTime: number;
}