import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesCycleService } from '../services/salesCycleService';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types';
import { useUI } from '../contexts/UIContext';

type SalesCycleUpdate = Partial<Database['public']['Tables']['sales_cycles']['Row']>;

export function useSalesCycle() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  const { data: salesCycle, isLoading, error } = useQuery({
    queryKey: ['salesCycle', user?.id],
    queryFn: () => salesCycleService.get(user!.id),
    enabled: !!user,
  });

  const updateSalesCycleMutation = useMutation({
    mutationFn: (updates: SalesCycleUpdate) => salesCycleService.update(user!.id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['salesCycle', user?.id] });
      queryClient.setQueryData(['salesCycle', user?.id], data);
      addNotification('Sales Cycle Updated', 'Your sales cycle dates have been saved.');
    },
  });

  return {
    salesCycle,
    isLoading,
    error,
    updateSalesCycle: updateSalesCycleMutation.mutate,
  };
}