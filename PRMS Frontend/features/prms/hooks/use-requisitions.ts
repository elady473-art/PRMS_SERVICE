import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { requisitionApi, RequisitionCreateRequest, handleApiError, isApiError } from "@/lib/prms-api";
import { queryKeys } from "@/lib/api";

export function useRequisitionsByRequester(requesterEmployeeId: string | null | undefined) {
  return useQuery({
    queryKey: [...queryKeys.purchaseRequests, { requesterEmployeeId }],
    queryFn: () => requisitionApi.listByRequester(requesterEmployeeId!),
    enabled: !!requesterEmployeeId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRequisitions() {
  return useQuery({
    queryKey: queryKeys.purchaseRequests,
    queryFn: () => requisitionApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRequisition(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.purchaseRequest(String(id)),
    queryFn: () => requisitionApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRequisition() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (body: RequisitionCreateRequest) => requisitionApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests });
      toast({ title: "Requisition created", description: `${data.requisitionNumber} has been saved.` });
    },
    onError: (err) => {
      toast({
        title: "Failed to create requisition",
        description: isApiError(err) ? handleApiError(err) : "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

export function useSubmitRequisition() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number | string) => requisitionApi.submit(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests });
      qc.invalidateQueries({ queryKey: queryKeys.purchaseRequest(String(data.id)) });
      toast({ title: "Requisition submitted", description: `${data.requisitionNumber} has been submitted for approval.` });
    },
    onError: (err) => {
      toast({
        title: "Failed to submit requisition",
        description: isApiError(err) ? handleApiError(err) : "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
