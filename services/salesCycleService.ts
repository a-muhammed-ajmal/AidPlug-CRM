import { supabase } from '../lib/supabase';
import { Database } from '../types';

type SalesCycle = Database['public']['Tables']['sales_cycles']['Row'];
type SalesCycleUpdate = Database['public']['Tables']['sales_cycles']['Update'];

export const salesCycleService = {
  get: async (userId: string): Promise<SalesCycle> => {
    const { data, error } = await supabase
      .from('sales_cycles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 'PGRST116' means no rows were found, which is not an error in this case.
    if (error && error.code !== 'PGRST116') throw error;
    if (data) return data;

    // Return a default object for the current month if none exists
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return {
      id: '', // A temporary ID
      user_id: userId,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: null,
    };
  },

  update: async (userId: string, updates: Partial<SalesCycleUpdate>): Promise<SalesCycle> => {
    const { data, error } = await supabase
      .from('sales_cycles')
      .upsert({
        user_id: userId,
        start_date: updates.start_date || new Date().toISOString().split('T')[0],
        end_date: updates.end_date || new Date().toISOString().split('T')[0],
        ...updates
      }) // Upsert is perfect here
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};