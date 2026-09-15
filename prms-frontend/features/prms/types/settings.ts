import { type PRMSRole } from "@/features/auth/types/roles";

export type SettingType = 
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'JSON'
  | 'PASSWORD'
  | 'EMAIL'
  | 'URL'
  | 'DATE'
  | 'TIME'
  | 'CURRENCY';

export type SettingCategory = 
  | 'GENERAL'
  | 'PROCUREMENT'
  | 'APPROVAL'
  | 'NOTIFICATION'
  | 'INTEGRATION'
  | 'SECURITY'
  | 'REPORTS'
  | 'WORKFLOW';

export type NotificationType = 
  | 'EMAIL'
  | 'SMS'
  | 'PUSH'
  | 'IN_APP';

/**
 * Workflow step role assignments.
 * These are internal procurement workflow roles used to define who must
 * approve each step — distinct from the three PRMS authentication roles
 * (PROCUREMENT_ADMIN, REQUESTER, SUPPLIER) that control navigation access.
 */
export type UserRole =
  | 'PROCUREMENT_ADMIN'
  | 'REQUESTER'
  | 'SUPPLIER'
  | 'DEPARTMENT_HEAD'
  | 'FINANCE_MANAGER'
  | 'APPROVER'
  | 'VIEWER';

export interface Setting {
  id: string;
  key: string;
  name: string;
  description?: string;
  value: any;
  defaultValue: any;
  type: SettingType;
  category: SettingCategory;
  required: boolean;
  encrypted: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  updatedBy?: string;
  updatedAt?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  roleRequired: UserRole[];
  conditions?: WorkflowCondition[];
  isActive: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  entity: 'PURCHASE_REQUEST' | 'RFQ' | 'QUOTATION' | 'PURCHASE_ORDER';
  isActive: boolean;
  steps: WorkflowStep[];
  conditions?: WorkflowCondition[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  description?: string;
  event: string;
  conditions?: WorkflowCondition[];
  recipients: NotificationRecipient[];
  templateId: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  type: 'USER' | 'ROLE' | 'EMAIL';
  value: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'ERP' | 'EMAIL' | 'SMS' | 'PAYMENT' | 'DOCUMENT' | 'ACCOUNTING';
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings: Record<string, any>;
  isActive: boolean;
  lastSyncAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfiguration {
  general: {
    companyName: string;
    companyLogo?: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  procurement: {
    defaultApprovalWorkflow: string;
    autoCreatePO: boolean;
    requireGRNForInvoice: boolean;
    allowPartialDelivery: boolean;
    defaultPaymentTerms: string;
    poNumberFormat: string;
    rfqNumberFormat: string;
  };
  approval: {
    parallelApproval: boolean;
    approvalTimeout: number;
    escalationEnabled: boolean;
    escalationTimeout: number;
    autoRejectTimeout: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emailFrom: string;
    emailHost: string;
    emailPort: number;
    smsProvider: string;
  };
  security: {
    sessionTimeout: number;
    passwordExpiry: number;
    maxLoginAttempts: number;
    twoFactorEnabled: boolean;
    auditLogRetention: number;
  };
  reports: {
    defaultFormat: 'PDF' | 'EXCEL' | 'CSV';
    autoScheduleEnabled: boolean;
    reportRetention: number;
    maxFileSize: number;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  budgetLimit?: number;
  currency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  /** The PRMS authentication role (PROCUREMENT_ADMIN | REQUESTER | SUPPLIER). */
  role: PRMSRole;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsFilter {
  category?: SettingCategory;
  search?: string;
  page?: number;
  size?: number;
}

export interface WorkflowFilter {
  entity?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  size?: number;
}

export interface NotificationFilter {
  type?: NotificationType;
  isActive?: boolean;
  search?: string;
  page?: number;
  size?: number;
}