import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesCycleService } from '../services/salesCycleService';
import { useAuth } from './useAuth';
import { Database } from '../types';
import { useUI } from '../contexts/UIContextDefinitions;

type SalesCycleUpdate = Partial<
  Database['public']['Tables']['sales_cycles']['Row']
>;

export function useSalesCycle() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addNotification } = useUI();
  const queryKey = ['salesCycle', user?.id];

  const {
    data: salesCycle,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => salesCycleService.get(user!.id),
    enabled: !!user,
    retry: false, // Don't retry on error to avoid defaulting
  });

  const updateSalesCycle = useMutation({
    mutationFn: (updates: SalesCycleUpdate) =>
      salesCycleService.update(user!.id, updates),
    onSuccess: (updatedSalesCycle) => {
      queryClient.setQueryData(queryKey, updatedSalesCycle);
      addNotification(
        'Sales Cycle Updated',
        'Your sales cycle dates have been saved.'
      );
    },
    onError: (error: Error) => {
      addNotification(
        'Update Failed',
        error.message || 'Could not save the sales cycle.'
      );
    },
  });

  return {
    salesCycle,
    isLoading,
    error,
    updateSalesCycle,
  };
}
