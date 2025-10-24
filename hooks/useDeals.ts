
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsService } from '../services/dealsService';
import { useAuth } from '../contexts/AuthContext';
import { Deal } from '../types';
import { useUI } from '../contexts/UIContext';

export function useDeals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity } = useUI();

  const { data: deals = [], isLoading, error } = useQuery<Deal[], Error>({
    queryKey: ['deals', user?.id],
    queryFn: () => dealsService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: dealsService.create,
    onSuccess: (newDeal) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      logActivity('deal_add', `Created deal: "${newDeal.title}"`);
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
    onSuccess: (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      logActivity('deal_stage_update', `Moved deal "${updatedDeal.title}" to ${updatedDeal.stage?.replace(/_/g, ' ') || 'a new stage'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (deal: Deal) => dealsService.delete(deal.id),
    onSuccess: (data, deal) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      logActivity('deal_delete', `Deleted deal: "${deal.title}"`);
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
