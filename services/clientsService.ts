
import { supabase } from '../lib/supabase';
import { Client } from '../types';

type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type ClientUpdate = Partial<ClientInsert>;

export const clientsService = {
  getAll: async (userId: string): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (clientData: ClientInsert): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: ClientUpdate): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
