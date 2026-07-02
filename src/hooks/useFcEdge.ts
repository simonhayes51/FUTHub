import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDashboard(name?: string) {
  return useQuery({ queryKey: ['dashboard', name], queryFn: () => api.getDashboard(name), staleTime: 60_000 });
}

export function useSbcs() {
  return useQuery({ queryKey: ['sbc', 'list'], queryFn: () => api.getSbcs(), staleTime: 60_000 });
}
export function useSbc(id: string | undefined) {
  return useQuery({ queryKey: ['sbc', id], queryFn: () => api.getSbc(id as string), enabled: Boolean(id) });
}

export function usePacks() {
  return useQuery({ queryKey: ['packs'], queryFn: () => api.getPacks(), staleTime: 5 * 60_000 });
}
export function useSimulatePack() {
  return useMutation({
    mutationFn: ({ id, count, seed }: { id: string; count?: number; seed?: string }) =>
      api.simulatePack(id, count, seed),
  });
}

export function useEvolutions() {
  return useQuery({ queryKey: ['evolutions'], queryFn: () => api.getEvolutions(), staleTime: 60_000 });
}

export function useObjectives() {
  return useQuery({ queryKey: ['objectives'], queryFn: () => api.getObjectives(), staleTime: 60_000 });
}
export function useRoadmap() {
  return useQuery({ queryKey: ['roadmap'], queryFn: () => api.getRoadmap(), staleTime: 60_000 });
}

export function useSquads(budget?: string) {
  return useQuery({ queryKey: ['squads', budget], queryFn: () => api.getSquads(budget), staleTime: 60_000 });
}

export function useCoach() {
  return useMutation({ mutationFn: (message: string) => api.askCoach(message) });
}

export function useNews(category?: string) {
  return useQuery({ queryKey: ['news', category], queryFn: () => api.getNews(category), staleTime: 60_000 });
}
