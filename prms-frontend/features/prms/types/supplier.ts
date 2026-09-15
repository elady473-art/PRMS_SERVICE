export type SupplierStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLACKLISTED'
  | 'PENDING_APPROVAL';

export type SupplierCategory = 
  | 'GOODS'
  | 'SERVICES'
  | 'WORKS'
  | 'CONSULTANCY';

export type CurrencyCode = 
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'ETB'
  | 'KES'
  | 'TZS';

export interface SupplierContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  companyName: string;
  tradingName?: string;
  category: SupplierCategory;
  status: SupplierStatus;
  taxId?: string;
  registrationNumber?: string;
  email: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  paymentTermsDays: number;
  creditLimit?: number;
  currency: CurrencyCode;
  rating?: number;
  notes?: string;
  contacts: SupplierContact[];
  documents: SupplierDocument[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SupplierRequest {
  companyName: string;
  tradingName?: string;
  category: SupplierCategory;
  taxId?: string;
  registrationNumber?: string;
  email: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  paymentTermsDays?: number;
  creditLimit?: number;
  currency?: CurrencyCode;
  notes?: string;
}

export interface SupplierSummary {
  id: string;
  supplierCode: string;
  companyName: string;
  category: SupplierCategory;
  status: SupplierStatus;
  email: string;
  phone?: string;
  city?: string;
  rating?: number;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface SupplierFilter {
  [key: string]: unknown;
  status?: SupplierStatus;
  category?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}