import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/prms-api';
import { queryKeys } from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
