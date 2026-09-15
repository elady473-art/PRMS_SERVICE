export type ApprovalStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type ApprovalDecision = 
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_CHANGES';

export type ApprovalEntityType = 
  | 'PURCHASE_REQUEST'
  | 'PURCHASE_ORDER'
  | 'CONTRACT'
  | 'RFQ'
  | 'QUOTATION'
  | 'INVOICE';

export interface ApprovalRequest {
  id: string;
  entityId: string;
  entityType: ApprovalEntityType;
  entityNumber: string;
  entityTitle: string;
  requesterId: string;
  requesterName: string;
  amount: number;
  currency: string;
  currentStep: number;
  totalSteps: number;
  currentApproverId: string;
  currentApproverName: string;
  status: ApprovalStatus;
  submittedAt: string;
  deadline: string;
  workflowId: string;
  workflowName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflowStep {
  id: string;
  stepOrder: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  minAmount: number;
  maxAmount: number;
  isOptional: boolean;
  requiresComment: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  entityType: ApprovalEntityType;
  minAmount: number;
  maxAmount: number;
  currency: string;
  active: boolean;
  steps: ApprovalWorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalDecisionRequest {
  decision: ApprovalDecision;
  comments: string;
  requiresRework?: boolean;
  nextReviewDate?: string;
}

export interface ApprovalHistory {
  id: string;
  approvalRequestId: string;
  stepOrder: number;
  approverId: string;
  approverName: string;
  decision: ApprovalDecision;
  comments: string;
  decisionDate: string;
}

export interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  overdue: number;
  averageProcessingTime: number;
  approvalRate: number;
}

export interface ApprovalFilter {
  status?: ApprovalStatus;
  entityType?: ApprovalEntityType;
  approverId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}