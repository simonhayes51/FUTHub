import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/** Market-wide sentiment + top picks for the dashboard. */
export function useMarketOverview() {
  return useQuery({
    queryKey: ['market', 'overview'],
    queryFn: () => api.getMarketOverview(),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

/** Ranked results for a single scanner category. */
export function useMarketScanner(category: string, limit = 20) {
  return useQuery({
    queryKey: ['market', 'scanner', category, limit],
    queryFn: () => api.getMarketScanner(category, limit),
    staleTime: 60_000,
  });
}

/** Available scanner categories. */
export function useScannerCategories() {
  return useQuery({
    queryKey: ['market', 'categories'],
    queryFn: () => api.getScannerCategories(),
    staleTime: 30 * 60_000,
  });
}

/** Full AI intelligence for a single card. */
export function useMarketIntelligence(id: string | undefined) {
  return useQuery({
    queryKey: ['market', 'intelligence', id],
    queryFn: () => api.getMarketIntelligence(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
