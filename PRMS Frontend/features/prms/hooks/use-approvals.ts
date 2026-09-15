import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { approvalApi, RequisitionApproveRequest, BackendApprovalAction, RequisitionResponse } from '@/lib/prms-api';
import { queryKeys, handleApiError, isApiError } from '@/lib/api';

export function usePendingApprovals() {
  return useQuery({
    queryKey: queryKeys.pendingApprovals,
    queryFn: () => approvalApi.listPending(),
    staleTime: 1 * 60 * 1000,
  });
}

interface ApprovalDecisionInput {
  requisitionId: number | string;
  action: BackendApprovalAction;
  comments?: string;
}

export function useDecideOnRequisition() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ requisitionId, action, comments }: ApprovalDecisionInput) => {
      const body: RequisitionApproveRequest = { action, comments };
      return approvalApi.decideOnRequisition(requisitionId, body);
    },
    onSuccess: (data, { requisitionId, action }) => {
      // Optimistically remove from pending approvals queue
      qc.setQueryData(queryKeys.pendingApprovals, (old: RequisitionResponse[] | undefined) => {
        if (!old) return [];
        return old.filter((item) => String(item.id) !== String(requisitionId));
      });
      qc.invalidateQueries({ queryKey: queryKeys.pendingApprovals });
      qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests });
      if (data?.id) {
        qc.invalidateQueries({ queryKey: queryKeys.purchaseRequest(String(data.id)) });
      }
      const reqNum = data?.requisitionNumber || `PR-${requisitionId}`;
      const label =
        action === 'APPROVE' ? 'approved' : action === 'REJECT' ? 'rejected' : 'returned for rework';
      toast({ title: 'Decision recorded', description: `${reqNum} ${label} successfully.` });
    },
    onError: (err: any) => {
      const msg = isApiError(err) ? handleApiError(err) : err?.message || 'Unexpected error occurred while processing approval decision.';
      toast({
        title: 'Failed to record decision',
        description: msg,
        variant: 'destructive',
      });
    },
  });
}
