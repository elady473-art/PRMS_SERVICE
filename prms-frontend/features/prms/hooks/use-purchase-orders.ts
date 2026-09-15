import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { purchaseOrderApi, PurchaseOrderCreateRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function usePurchaseOrders() {
  return useQuery({
    queryKey: queryKeys.purchaseOrders,
    queryFn: () => purchaseOrderApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePurchaseOrder(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.purchaseOrder(String(id)),
    queryFn: () => purchaseOrderApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: PurchaseOrderCreateRequest) => purchaseOrderApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.purchaseOrders });
      toast({ title: 'Purchase Order created', description: `${data.purchaseOrderNumber} issued.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create purchase order',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
