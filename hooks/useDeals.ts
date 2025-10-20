
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsService } from '../services/dealsService';
import { useAuth } from '../contexts/AuthContext';
import { Deal } from '../types';

export function useDeals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading, error } = useQuery<Deal[], Error>({
    queryKey: ['deals', user?.id],
    queryFn: () => dealsService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: dealsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Deal> }) => dealsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Deal['stage'] }) => dealsService.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dealsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  return {
    deals,
    isLoading,
    error,
    createDeal: createMutation.mutate,
    updateDeal: updateMutation.mutate,
    updateStage: updateStageMutation.mutate,
    deleteDeal: deleteMutation.mutate,
  };
}
