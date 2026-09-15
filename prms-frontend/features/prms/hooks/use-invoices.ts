import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invoiceApi, InvoiceRequest, handleApiError, isApiError } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices,
    queryFn: () => invoiceApi.list(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useInvoice(id: number | string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.invoice(String(id)),
    queryFn: () => invoiceApi.getById(id!),
    enabled: id != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSubmitInvoice() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: InvoiceRequest) => invoiceApi.submit(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices });
      toast({ title: 'Invoice submitted', description: `${data.invoiceNumber} submitted.` });
    },
    onError: (err) => {
      toast({
        title: 'Failed to submit invoice',
        description: isApiError(err) ? handleApiError(err) : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });
}
