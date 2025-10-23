
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../services/tasksService';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types';
import { useUI } from '../contexts/UIContext';

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity } = useUI();

  const { data: tasks = [], isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', user?.id],
    queryFn: () => tasksService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: tasksService.create,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      logActivity('task_add', `Created task: "${newTask.title}"`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => tasksService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) => tasksService.toggleComplete(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (updatedTask.status === 'completed') {
        logActivity('task_complete', `Completed task: "${updatedTask.title}"`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    toggleComplete: toggleCompleteMutation.mutate,
    deleteTask: deleteMutation.mutate,
  };
}
