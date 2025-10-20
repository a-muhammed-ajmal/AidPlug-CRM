
import { supabase } from '../lib/supabase';
import { Lead } from '../types';

type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type LeadUpdate = Partial<LeadInsert>;


export const leadsService = {
  getAll: async (userId: string): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (leadData: LeadInsert): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: LeadUpdate): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
