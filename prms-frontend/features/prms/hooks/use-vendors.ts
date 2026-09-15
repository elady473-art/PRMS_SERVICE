import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { vendorApi, VendorCreateRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useVendors() {
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: () => vendorApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVendor(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.supplier(String(id)),
    queryFn: () => vendorApi.getById(id!),
    enabled: id != null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: VendorCreateRequest) => vendorApi.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.suppliers });
      toast({ title: 'Vendor registered', description: `${data.name} (${data.vendorCode}) created.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create vendor',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
