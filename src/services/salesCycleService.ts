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
    // Only upsert if we have both start_date and end_date
    if (updates.start_date && updates.end_date) {
      const { data, error } = await supabase
        .from('sales_cycles')
        .upsert(
          {
            user_id: userId,
            start_date: updates.start_date,
            end_date: updates.end_date,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // If only partial updates, try to update existing record
      const { data: existing } = await supabase
        .from('sales_cycles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('sales_cycles')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // No existing record and incomplete data, throw error
        throw new Error('Cannot create sales cycle without both start and end dates');
      }
    }
  },
};
