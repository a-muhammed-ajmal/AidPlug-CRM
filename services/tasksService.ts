import { supabase } from '../lib/supabase';
import { Task } from '../types';

type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type TaskUpdate = Partial<TaskInsert>;

export const tasksService = {
  getAll: async (userId: string): Promise<Task[]> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to load tasks. Please try again.');
    }
  },

  getById: async (id: string): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to load task details. Please try again.');
    }
  },

  create: async (taskData: TaskInsert): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task. Please try again.');
    }
  },

  update: async (id: string, updates: TaskUpdate): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task. Please try again.');
    }
  },

  toggleComplete: async (id: string, currentStatus: Task['status']): Promise<Task> => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return tasksService.update(id, { status: newStatus });
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task. Please try again.');
    }
  },
};