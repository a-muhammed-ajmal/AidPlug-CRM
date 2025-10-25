import { supabase } from '../lib/supabase';
import { Database } from '../types';

type SalesCycle = Database['public']['Tables']['sales_cycles']['Row'];
type SalesCycleUpdate = Database['public']['Tables']['sales_cycles']['Update'];

export const salesCycleService = {
  get: async (userId: string): Promise<SalesCycle | null> => {
    const { data, error } = await supabase
      .from('sales_cycles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 'PGRST116' means no rows were found, which is not an error in this case.
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  update: async (
    userId: string,
    updates: Partial<SalesCycleUpdate>
  ): Promise<SalesCycle> => {
    const { data, error } = await supabase
      .from('sales_cycles')
      .upsert(
        {
          user_id: userId,
          ...updates,
        } as Database['public']['Tables']['sales_cycles']['Insert'],
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
