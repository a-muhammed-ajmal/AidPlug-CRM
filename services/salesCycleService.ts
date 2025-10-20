import { supabase } from '../lib/supabase';
import { Database } from '../types';

type SalesCycle = Database['public']['Tables']['sales_cycles']['Row'];
type SalesCycleUpdate = Partial<Omit<SalesCycle, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export const salesCycleService = {
  get: async (userId: string): Promise<SalesCycle> => {
    const { data, error } = await supabase
      .from('sales_cycles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) return data;

    // Return default for current month if none exists
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return {
      id: '', 
      user_id: userId,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: null,
    };
  },

  update: async (userId: string, updates: SalesCycleUpdate): Promise<SalesCycle> => {
    const { data: existing, error: fetchError } = await supabase
      .from('sales_cycles')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    const { data, error } = await supabase
      .from('sales_cycles')
      // FIX: Cast to 'any' to resolve type mismatch for upsert operation.
      // The `updates` type is partial, but `upsert` requires a full object for inserts.
      // The calling code ensures all required fields are present at runtime.
      .upsert({ ...updates, id: existing?.id, user_id: userId } as any)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
};
