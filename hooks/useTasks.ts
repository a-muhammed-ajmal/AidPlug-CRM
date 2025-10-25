import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCrudHooks, createDeleteMutationHook } from './createCrudHooks';
import { tasksService } from '../services/tasksService';
import { useUI } from '../contexts/UIContext';
import { Task, Database } from '../types';
import { useAuth } from '../contexts/AuthContext';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

const { useGetAll, useCreateMutation, useUpdateMutation } =
  createCrudHooks<Task, TaskInsert, TaskUpdate>('tasks', tasksService);

const useDeleteMutation = createDeleteMutationHook<Task>('tasks', tasksService);

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity, addNotification } = useUI();

  const { data: tasks = [], ...query } = useGetAll();

  const createTask = useCreateMutation({
    onSuccess: (newTask) => {
      logActivity('task_add', `Created task: "${newTask.title}"`);
      addNotification('Success', 'Task created successfully.');
    },
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to create task.'),
  });

  const updateTask = useUpdateMutation({
    onSuccess: () => addNotification('Success', 'Task updated successfully.'),
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to update task.'),
  });

  const toggleTaskComplete = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      tasksService.toggleComplete(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      if (updatedTask.status === 'completed') {
        logActivity('task_complete', `Completed task: "${updatedTask.title}"`);
      }
    },
    onError: (error: Error) =>
      addNotification(
        'Error',
        error.message || 'Failed to update task status.'
      ),
  });

  const deleteTask = useDeleteMutation({
    onSuccess: () => addNotification('Success', 'Task deleted.'),
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to delete task.'),
  });

  return {
    tasks,
    isLoading: query.isLoading,
    error: query.error,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
  };
}
