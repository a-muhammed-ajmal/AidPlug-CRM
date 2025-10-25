import { createCrudHooks, createDeleteMutationHook } from './createCrudHooks';
import { clientsService } from '../services/clientsService';
import { useUI } from '../contexts/UIContext';
import { Client, Database } from '../types';

type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

const { useGetAll, useCreateMutation, useUpdateMutation } =
  createCrudHooks<Client, ClientInsert, ClientUpdate>(
    'clients',
    clientsService
  );

const useDeleteMutation = createDeleteMutationHook<Client>('clients', clientsService);

export function useClients() {
  const { logActivity, addNotification } = useUI();

  const { data: clients = [], ...query } = useGetAll();

  const createClient = useCreateMutation({
    onSuccess: (newClient) => {
      logActivity('client_add', `Added new client: "${newClient.full_name}"`);
      addNotification('Success', 'Client created successfully.');
    },
    onError: (error) => {
      addNotification('Error', error.message || 'Failed to create client.');
    },
  });

  const updateClient = useUpdateMutation({
    onSuccess: () => addNotification('Success', 'Client updated successfully.'),
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to update client.'),
  });

  const deleteClient = useDeleteMutation({
    onSuccess: () => addNotification('Success', 'Client deleted.'),
    onError: (error) =>
      addNotification('Error', error.message || 'Failed to delete client.'),
  });

  return {
    clients,
    isLoading: query.isLoading,
    error: query.error,
    createClient,
    updateClient,
    deleteClient,
  };
}
