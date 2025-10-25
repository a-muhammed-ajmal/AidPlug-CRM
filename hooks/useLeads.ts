import { createCrudHooks } from './createCrudHooks';
import { leadsService } from '../services/leadsService';
import { useUI } from '../contexts/UIContext';
import { Lead, Database } from '../types';

type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

const { useGetAll, useCreateMutation, useUpdateMutation, useDeleteMutation } =
  createCrudHooks<Lead, LeadInsert, LeadUpdate>('leads', leadsService);

export function useLeads() {
  const { logActivity, addNotification } = useUI();
  
  const { data: leads = [], ...query } = useGetAll();

  const createLead = useCreateMutation({
    onSuccess: (newLead) => {
      logActivity('lead_add', `Created lead: "${newLead.full_name}"`);
      addNotification('Success', 'Lead created successfully.');
    },
    onError: (error) => addNotification('Error', error.message || 'Failed to create lead.'),
  });

  const updateLead = useUpdateMutation({
    onSuccess: (updatedLead) => {
      logActivity('lead_update', `Updated lead: "${updatedLead.full_name}"`);
      addNotification('Success', 'Lead updated successfully.');
    },
    onError: (error) => addNotification('Error', error.message || 'Failed to update lead.'),
  });
  
  const deleteLead = useDeleteMutation({
    onSuccess: () => {
      logActivity('lead_delete', `Deleted a lead.`);
      addNotification('Success', 'Lead deleted.');
    },
    onError: (error) => addNotification('Error', error.message || 'Failed to delete lead.'),
  });

  return {
    leads,
    isLoading: query.isLoading,
    error: query.error,
    createLead,
    updateLead,
    deleteLead,
  };
}