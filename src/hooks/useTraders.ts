import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useTraders(params?: { specialty?: string; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['traders', params],
    queryFn: () => api.getTraders(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useTrader(id: string) {
  return useQuery({
    queryKey: ['trader', id],
    queryFn: () => api.getTrader(id),
    enabled: !!id,
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ traderId, tier }: { traderId: string; tier: 'MONTHLY' | 'YEARLY' }) =>
      api.subscribeToTrader(traderId, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traders'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast({
        title: 'Subscribed!',
        description: 'You can now see premium content from this trader.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to subscribe',
        variant: 'destructive',
      });
    },
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (traderId: string) => api.unsubscribeFromTrader(traderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traders'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast({
        title: 'Unsubscribed',
        description: 'You will no longer see premium content from this trader.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to unsubscribe',
        variant: 'destructive',
      });
    },
  });
}
