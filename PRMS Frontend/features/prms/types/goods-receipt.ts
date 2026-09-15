export type GoodsReceiptStatus = 
  | 'DRAFT'
  | 'RECEIVED'
  | 'INSPECTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PARTIALLY_ACCEPTED';

export type ItemCondition = 
  | 'GOOD'
  | 'DAMAGED'
  | 'DEFECTIVE'
  | 'PARTIAL';

export interface GoodsReceiptItem {
  id: string;
  poItemId: string;
  itemCode: string;
  description: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  condition: ItemCondition;
  notes?: string;
  serialNumbers?: string[];
  batchNumbers?: string[];
  expiryDate?: string;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: GoodsReceiptStatus;
  receivedDate: string;
  receivedBy: string;
  inspectedBy?: string;
  inspectedAt?: string;
  warehouseLocation: string;
  carrierName?: string;
  trackingNumber?: string;
  deliveryNoteNumber?: string;
  packingSlips?: string[];
  notes?: string;
  items: GoodsReceiptItem[];
  attachments: GoodsReceiptAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface GoodsReceiptRequest {
  poId: string;
  receivedDate: string;
  warehouseLocation: string;
  carrierName?: string;
  trackingNumber?: string;
  deliveryNoteNumber?: string;
  notes?: string;
  items: GoodsReceiptItemRequest[];
}

export interface GoodsReceiptItemRequest {
  poItemId: string;
  receivedQuantity: number;
  condition: ItemCondition;
  notes?: string;
  serialNumbers?: string[];
  batchNumbers?: string[];
  expiryDate?: string;
}

export interface GoodsReceiptSummary {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  status: GoodsReceiptStatus;
  receivedDate: string;
  itemsCount: number;
  totalValue: number;
  currency: string;
  receivedBy: string;
  createdAt: string;
}

export interface GoodsReceiptFilter {
  status?: GoodsReceiptStatus;
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

export interface GoodsReceiptStats {
  total: number;
  received: number;
  inspected: number;
  accepted: number;
  rejected: number;
  totalValue: number;
  averageProcessingTime: number;
}