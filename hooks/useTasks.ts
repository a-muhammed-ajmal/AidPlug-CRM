
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../services/tasksService';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types';

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', user?.id],
    queryFn: () => tasksService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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