
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../services/leadsService';
import { useAuth } from '../contexts/AuthContext';
import { Lead } from '../types';
import { useUI } from '../contexts/UIContext';

export function useLeads() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity } = useUI();

  const { data: leads = [], isLoading, error } = useQuery<Lead[], Error>({
    queryKey: ['leads', user?.id],
    queryFn: () => leadsService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: leadsService.create,
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      logActivity('lead_add', `Created lead: "${newLead.full_name}"`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Lead> }) => leadsService.update(id, updates),
    onSuccess: (updatedLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      logActivity('lead_update', `Updated lead: "${updatedLead.full_name}"`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (lead: Lead) => leadsService.delete(lead.id),
    onSuccess: (data, lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      logActivity('lead_delete', `Deleted lead: "${lead.full_name}"`);
    },
  });

  return {
    leads,
    isLoading,
    error,
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,
  };
}
