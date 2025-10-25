import { createCrudService } from './baseService';
import { Task, Database } from '../types';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

const baseTasksService = createCrudService<Task, TaskInsert, TaskUpdate>('tasks');

export const tasksService = {
  ...baseTasksService,
  // Custom logic specific to tasks
  toggleComplete: async (id: string, currentStatus: Task['status']): Promise<Task> => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return baseTasksService.update(id, { status: newStatus });
  },
};