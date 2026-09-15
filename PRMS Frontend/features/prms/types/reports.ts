export type ReportType = 
  | 'SPEND_ANALYSIS'
  | 'SUPPLIER_PERFORMANCE'
  | 'PURCHASE_ORDERS'
  | 'QUOTATION_COMPARISON'
  | 'INVENTORY_RECEIPT'
  | 'PAYMENT_STATUS'
  | 'AUDIT_TRAIL'
  | 'COMPLIANCE'
  | 'VENDOR_EVALUATION'
  | 'COST_SAVINGS';

export type ReportStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'GENERATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type ReportFormat = 
  | 'PDF'
  | 'EXCEL'
  | 'CSV'
  | 'JSON';

export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'SUBMIT'
  | 'CANCEL'
  | 'VIEW'
  | 'DOWNLOAD'
  | 'EXPORT';

export type AuditEntity = 
  | 'SUPPLIER'
  | 'PURCHASE_REQUEST'
  | 'APPROVAL'
  | 'RFQ'
  | 'QUOTATION'
  | 'PURCHASE_ORDER'
  | 'GOODS_RECEIPT'
  | 'INVOICE'
  | 'PAYMENT'
  | 'REPORT'
  | 'USER'
  | 'SETTINGS';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  status: ReportStatus;
  format: ReportFormat;
  parameters: ReportParameters;
  scheduledFor?: string;
  generatedAt?: string;
  completedAt?: string;
  fileUrl?: string;
  fileSize?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportParameters {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  categoryId?: string;
  departmentId?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  includeDetails?: boolean;
  groupBy?: string[];
  filters?: Record<string, any>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  parameters: ReportParameterDefinition[];
  isSystem: boolean;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportParameterDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ReportSummary {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  format: ReportFormat;
  generatedAt?: string;
  fileSize?: number;
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  entityName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  description?: string;
  timestamp: string;
}

export interface AuditLogSummary {
  id: string;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityName?: string;
  description?: string;
  timestamp: string;
}

export interface ReportFilter {
  type?: ReportType;
  status?: ReportStatus;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface AuditLogFilter {
  userId?: string;
  action?: AuditAction;
  entity?: AuditEntity;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface ReportStats {
  total: number;
  scheduled: number;
  completed: number;
  failed: number;
  totalFileSize: number;
  averageGenerationTime: number;
}

export interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
  topActions: { action: AuditAction; count: number }[];
  topEntities: { entity: AuditEntity; count: number }[];
}

export interface DashboardMetrics {
  totalSpend: number;
  totalSavings: number;
  totalSuppliers: number;
  totalPOs: number;
  avgProcessingTime: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  complianceRate: number;
  spendByCategory: { category: string; amount: number; percentage: number }[];
  spendTrend: { month: string; amount: number }[];
  topSuppliers: { name: string; amount: number; percentage: number }[];
}