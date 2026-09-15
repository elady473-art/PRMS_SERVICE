import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { goodsReceiptApi, GoodsReceiptRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useGoodsReceipts() {
  return useQuery({
    queryKey: queryKeys.goodsReceipts,
    queryFn: () => goodsReceiptApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useGoodsReceipt(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.goodsReceipt(String(id)),
    queryFn: () => goodsReceiptApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateGoodsReceipt() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: GoodsReceiptRequest) => goodsReceiptApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.goodsReceipts });
      qc.invalidateQueries({ queryKey: queryKeys.purchaseOrder(String(data.purchaseOrderId)) });
      toast({ title: 'Goods receipt recorded', description: `${data.receiptNumber} recorded.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to record goods receipt',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
