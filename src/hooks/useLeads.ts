import { createCrudHooks, createDeleteMutationHook } from './createCrudHooks';
import { leadsService } from '../services/leadsService';
import { useUI } from '../contexts/UIContextDefinitions';
import { Lead, Database } from '../types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

const { useCreateMutation, useUpdateMutation } = createCrudHooks<
  Lead,
  LeadInsert,
  LeadUpdate
>('leads', leadsService);

const useDeleteMutation = createDeleteMutationHook<Lead>('leads', leadsService);

export function useLeads() {
  const { logActivity, addNotification } = useUI();

  // Explicitly select all fields including new credit card application fields
  const { data: leads = [], ...query } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(
          `
          id,
          created_at,
          full_name,
          email,
          phone,
          company_name,
          location,
          monthly_salary,
          product,
          product_type,
          bank_name,
          stage,
          user_id,
          loan_amount_requested,
          salary_months,
          salary_variations,
          existing_cards,
          cards_duration,
          total_credit_limit,
          has_emi,
          emi_amount,
          applied_recently,
          documents_available
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Lead[];
    },
  });

  const createLead = useCreateMutation({
    onSuccess: (newLead) => {
      logActivity('lead_add', `Created lead: "${newLead.full_name}"`);
      addNotification('Success', 'Lead created successfully.');
      // Immediate refresh to show real-time updates
      query.refetch();
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to create lead.'),
  });

  const updateLead = useUpdateMutation({
    onSuccess: (updatedLead) => {
      logActivity('lead_update', `Updated lead: "${updatedLead.full_name}"`);
      addNotification('Success', 'Lead updated successfully.');
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to update lead.'),
  });

  const deleteLead = useDeleteMutation({
    onSuccess: () => {
      logActivity('lead_delete', `Deleted a lead.`);
      addNotification('Success', 'Lead deleted.');
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to delete lead.'),
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
