import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { contractApi, ContractCreateRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useContracts() {
  return useQuery({
    queryKey: queryKeys.contracts,
    queryFn: () => contractApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useContract(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.contract(String(id)),
    queryFn: () => contractApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: ContractCreateRequest) => contractApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts });
      toast({ title: 'Contract created', description: `${data.contractNumber} created.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create contract',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
