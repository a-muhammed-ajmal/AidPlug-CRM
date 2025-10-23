import { supabase } from '../lib/supabase';
import { Lead } from '../types';

type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type LeadUpdate = Partial<LeadInsert>;


export const leadsService = {
  getAll: async (userId: string): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw new Error('Failed to load leads. Please try again.');
    }
  },

  getById: async (id: string): Promise<Lead> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw new Error('Failed to load lead details. Please try again.');
    }
  },

  create: async (leadData: LeadInsert): Promise<Lead> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead. Please try again.');
    }
  },

  update: async (id: string, updates: LeadUpdate): Promise<Lead> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw new Error('Failed to update lead. Please try again.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw new Error('Failed to delete lead. Please try again.');
    }
  },
};