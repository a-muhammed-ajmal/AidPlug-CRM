import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCrudHooks, createDeleteMutationHook } from './createCrudHooks';
import { dealsService } from '../services/dealsService';
import { useUI } from '../contexts/UIContext';
import { Deal, Database } from '../types';
import { useAuth } from '../contexts/AuthContext';

type DealInsert = Database['public']['Tables']['deals']['Insert'];
type DealUpdate = Database['public']['Tables']['deals']['Update'];

const { useGetAll, useCreateMutation, useUpdateMutation } =
  createCrudHooks<Deal, DealInsert, DealUpdate>('deals', dealsService);

const useDeleteMutation = createDeleteMutationHook<Deal>('deals', dealsService);

export function useDeals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity, addNotification } = useUI();

  const { data: deals = [], ...query } = useGetAll();

  const createDeal = useCreateMutation({
    onSuccess: (newDeal) => {
      logActivity('deal_add', `Created deal: "${newDeal.title}"`);
      addNotification('Success', 'Deal created successfully.');
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to create deal.'),
  });

  const updateDeal = useUpdateMutation({
    onSuccess: () => addNotification('Success', 'Deal updated successfully.'),
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to update deal.'),
  });

  // Custom mutation for a specific action
  const updateDealStage = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Deal['stage'] }) =>
      dealsService.updateStage(id, stage),
    onSuccess: (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: ['deals', user?.id] });
      logActivity(
        'deal_stage_update',
        `Moved deal "${updatedDeal.title}" to ${updatedDeal.stage?.replace(/_/g, ' ') || 'a new stage'}`
      );
    },
    onError: (error: Error) =>
      addNotification('Error', error.message || 'Failed to update deal stage.'),
  });

  const deleteDeal = useDeleteMutation({
    onSuccess: (_, variables) => {
      // Note: For optimistic delete, we don't have the full object here.
      // The activity log might need to be adjusted or fired onMutate.
      logActivity('deal_delete', `Deleted a deal.`);
      addNotification('Success', 'Deal deleted.');
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to delete deal.'),
  });

  return {
    deals,
    isLoading: query.isLoading,
    error: query.error,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
  };
}
