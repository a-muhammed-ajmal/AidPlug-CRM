import { supabase } from '../lib/supabase';
import { Deal, Database } from '../types';

type DealInsert = Database['public']['Tables']['deals']['Insert'];
type DealUpdate = Database['public']['Tables']['deals']['Update'];

export const dealsService = {
  getAll: async (userId: string): Promise<Deal[]> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw new Error('Failed to load deals. Please try again.');
    }
  },

  getById: async (id: string): Promise<Deal> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw new Error('Failed to load deal details. Please try again.');
    }
  },

  create: async (dealData: DealInsert): Promise<Deal> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([dealData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw new Error('Failed to create deal. Please try again.');
    }
  },

  update: async (id: string, updates: DealUpdate): Promise<Deal> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw new Error('Failed to update deal. Please try again.');
    }
  },
  
  updateStage: async (id: string, newStage: Deal['stage']): Promise<Deal> => {
    const updates: DealUpdate = { stage: newStage };
    return dealsService.update(id, updates);
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw new Error('Failed to delete deal. Please try again.');
    }
  },
};