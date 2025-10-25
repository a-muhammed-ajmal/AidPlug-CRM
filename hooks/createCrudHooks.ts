import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { CrudService } from '../services/baseService';
import { PostgrestError } from '@supabase/supabase-js';

// Type for mutation options, allowing consumers to add their own callbacks
type MutateOptions<TData, TVariables> = Omit<
  UseMutationOptions<
    TData,
    Error | PostgrestError,
    TVariables,
    OptimisticUpdateContext<TData>
  >,
  'mutationFn'
>;

// Define the context type for optimistic updates
interface OptimisticUpdateContext<TData> {
  previousItems: TData[];
}

/**
 * A factory function to create a standard set of TanStack Query hooks for a resource.
 * Includes optimistic updates for a snappy UI experience.
 * @param resourceKey - A unique string key for the resource (e.g., 'clients', 'leads').
 * @param service - The corresponding CRUD service for the resource.
 */
export function createCrudHooks<
  TRow extends { id: string },
  TInsert extends { user_id: string },
  TUpdate,
>(resourceKey: string, service: CrudService<TRow, TInsert, TUpdate>) {
  // Hook to fetch all items for the resource
  const useGetAll = () => {
    const { user } = useAuth();
    return useQuery<TRow[], Error | PostgrestError>({
      queryKey: [resourceKey, user?.id],
      queryFn: () => service.getAll(user!.id),
      enabled: !!user,
    });
  };

  // Hook for creating a new item
  const useCreateMutation = (options?: MutateOptions<TRow, TInsert>) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const queryKey = [resourceKey, user?.id];

    return useMutation<
      TRow,
      Error | PostgrestError,
      TInsert,
      OptimisticUpdateContext<TRow>
    >({
      mutationFn: service.create,
      onMutate: async (newItemData) => {
        await queryClient.cancelQueries({ queryKey });
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey) || [];
        const tempId = `temp-${Date.now()}`; // Create a temporary ID
        queryClient.setQueryData<TRow[]>(queryKey, [
          ...previousItems,
          { ...newItemData, id: tempId } as unknown as TRow,
        ]);
        return { previousItems };
      },
      onError: (err, newItem, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(queryKey, context.previousItems); // Rollback on error
        }
        options?.onError?.(err, newItem, context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey }); // Always refetch to sync with server
      },
      ...options,
    });
  };

  // Hook for updating an item
  const useUpdateMutation = (
    options?: MutateOptions<TRow, { id: string; updates: TUpdate }>
  ) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const queryKey = [resourceKey, user?.id];

    return useMutation<
      TRow,
      Error | PostgrestError,
      { id: string; updates: TUpdate },
      OptimisticUpdateContext<TRow>
    >({
      mutationFn: ({ id, updates }) => service.update(id, updates),
      onMutate: async ({ id, updates }) => {
        await queryClient.cancelQueries({ queryKey });
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey) || [];
        const updatedItems = previousItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        queryClient.setQueryData(queryKey, updatedItems);
        return { previousItems };
      },
      onError: (err, variables, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(queryKey, context.previousItems);
        }
        options?.onError?.(err, variables, context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
      ...options,
    });
  };

  // Hook for deleting an item
  const useDeleteMutation = (options?: MutateOptions<void, string>) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const queryKey = [resourceKey, user?.id];

    return useMutation<
      void,
      Error | PostgrestError,
      string,
      OptimisticUpdateContext<TRow>
    >({
      mutationFn: service.delete,
      onMutate: async (itemId) => {
        await queryClient.cancelQueries({ queryKey });
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey) || [];
        const updatedItems = previousItems.filter((item) => item.id !== itemId);
        queryClient.setQueryData(queryKey, updatedItems);
        return { previousItems };
      },
      onError: (err, variables, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(queryKey, context.previousItems);
        }
        options?.onError?.(err, variables, context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
      ...options,
    });
  };

  return { useGetAll, useCreateMutation, useUpdateMutation, useDeleteMutation };
}
