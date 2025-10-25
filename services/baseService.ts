import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '../types';

// This creates a type that is a list of all your table names, like "clients" | "leads" | ...
type TableName = keyof Database['public']['Tables'];

// Define a generic interface for the services our factory will create.
// TRow is the main type (e.g., Client, Deal)
// TInsert is the type for creating a new row
// TUpdate is the type for updating a row
export interface CrudService<TRow, TInsert, TUpdate> {
  getAll(userId: string): Promise<TRow[]>;
  getById(id: string): Promise<TRow>;
  create(data: TInsert): Promise<TRow>;
  update(id: string, updates: TUpdate): Promise<TRow>;
  delete(id: string): Promise<void>;
}

/**
 * A factory function to create a standard CRUD service for a given Supabase table.
 * @param tableName The name of the Supabase table.
 */
export function createCrudService<
  TRow extends { id: string },
  TInsert extends { user_id: string },
  TUpdate
>(tableName: TableName): CrudService<TRow, TInsert, TUpdate> {
  
  const handleSupabaseError = (error: PostgrestError | null, context: string) => {
    if (error) {
      console.error(`Error in ${context} for table ${tableName}:`, error);
      throw error; // Re-throw the original error
    }
  };

  return {
    getAll: async (userId: string): Promise<TRow[]> => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      handleSupabaseError(error, 'getAll');
      return (data as unknown as TRow[]) || [];
    },

    getById: async (id: string): Promise<TRow> => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      handleSupabaseError(error, 'getById');
      return data as unknown as TRow;
    },

    create: async (insertData: TInsert): Promise<TRow> => {
      const { data, error } = await supabase
        .from(tableName)
        .insert([insertData])
        .select()
        .single();

      handleSupabaseError(error, 'create');
      return data as unknown as TRow;
    },

    update: async (id: string, updates: TUpdate): Promise<TRow> => {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      handleSupabaseError(error, 'update');
      return data as unknown as TRow;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      handleSupabaseError(error, 'delete');
    },
  };
}
