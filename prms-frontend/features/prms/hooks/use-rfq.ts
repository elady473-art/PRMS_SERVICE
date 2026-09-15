import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { rfqApi, RFQCreateRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useRFQs() {
  return useQuery({
    queryKey: queryKeys.rfqs,
    queryFn: () => rfqApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRFQ(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.rfq(String(id)),
    queryFn: () => rfqApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRFQ() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: RFQCreateRequest) => rfqApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.rfqs });
      toast({ title: 'RFQ created', description: `${data.rfqNumber} created.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create RFQ',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
