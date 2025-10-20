
import { supabase } from '../lib/supabase';
import { Deal } from '../types';

type DealInsert = Omit<Deal, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type DealUpdate = Partial<DealInsert>;

export const dealsService = {
  getAll: async (userId: string): Promise<Deal[]> => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string): Promise<Deal> => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (dealData: DealInsert): Promise<Deal> => {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: DealUpdate): Promise<Deal> => {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateStage: async (id: string, newStage: Deal['stage']): Promise<Deal> => {
    const updates: DealUpdate = { stage: newStage };
    if (newStage === 'completed') {
      updates.completed_date = new Date().toISOString().split('T')[0];
    }
    return dealsService.update(id, updates);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
