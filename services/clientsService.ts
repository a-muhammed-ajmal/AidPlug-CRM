import { supabase } from '../lib/supabase';
import { Client } from '../types';

type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type ClientUpdate = Partial<ClientInsert>;

export const clientsService = {
  getAll: async (userId: string): Promise<Client[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Failed to load clients. Please try again.');
    }
  },

  getById: async (id: string): Promise<Client> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw new Error('Failed to load client details. Please try again.');
    }
  },

  create: async (clientData: ClientInsert): Promise<Client> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client. Please try again.');
    }
  },

  update: async (id: string, updates: ClientUpdate): Promise<Client> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw new Error('Failed to update client. Please try again.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw new Error('Failed to delete client. Please try again.');
    }
  },
};