import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/features/prms/services/supplier-service';
import { queryKeys, handleApiError, isApiError } from '@/lib/api';

export const useSuppliers = (filter?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [...queryKeys.suppliers, filter],
    queryFn: () => supplierService.getSuppliers(filter),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: queryKeys.supplier(id),
    queryFn: () => supplierService.getSupplier(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useSupplierPerformance = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.supplier(id), 'performance'],
    queryFn: () => supplierService.getSupplierPerformance(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: Parameters<typeof supplierService.createSupplier>[0]) =>
      supplierService.createSupplier(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
      toast({ title: 'Supplier created', description: `${response.data?.companyName ?? ''} created.` });
    },
    onError: (error) => {
      const message = isApiError(error) ? handleApiError(error) : 'Failed to create supplier';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof supplierService.updateSupplier>[1] }) =>
      supplierService.updateSupplier(id, data),
    onSuccess: (_response, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplier(id) });
      toast({ title: 'Supplier updated' });
    },
    onError: (error) => {
      const message = isApiError(error) ? handleApiError(error) : 'Failed to update supplier';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    },
  });
};
