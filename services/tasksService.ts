
import { supabase } from '../lib/supabase';
import { Task } from '../types';

type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type TaskUpdate = Partial<TaskInsert>;

export const tasksService = {
  getAll: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (taskData: TaskInsert): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: TaskUpdate): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  toggleComplete: async (id: string, currentStatus: Task['status']): Promise<Task> => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return tasksService.update(id, { status: newStatus });
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};