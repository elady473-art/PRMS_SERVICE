import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { quotationApi, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useQuotations(rfqId?: number | string) {
  return useQuery({
    queryKey: rfqId ? [...queryKeys.quotations, { rfqId }] : queryKeys.quotations,
    queryFn: () => quotationApi.list(rfqId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useQuotation(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.quotation(String(id)),
    queryFn: () => quotationApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateQuotation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: Parameters<typeof quotationApi.create>[0]) => quotationApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.quotations });
      toast({ title: 'Quotation created', description: `${data.quotationNumber} submitted.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create quotation',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}

export function useSelectQuotation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number | string) => quotationApi.select(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.quotations });
      toast({ title: 'Quotation selected', description: `${data.quotationNumber} selected for award.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to select quotation',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
