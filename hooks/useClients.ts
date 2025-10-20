
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '../services/clientsService';
import { useAuth } from '../contexts/AuthContext';
import { Client } from '../types';

export function useClients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery<Client[], Error>({
    queryKey: ['clients', user?.id],
    queryFn: () => clientsService.getAll(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Client> }) => clientsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clientsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
  };
}
