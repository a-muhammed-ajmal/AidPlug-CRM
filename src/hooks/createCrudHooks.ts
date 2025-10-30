// hooks/createCrudHooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { CrudService } from '../services/baseService';
import { PostgrestError } from '@supabase/supabase-js';

// This interface now only covers create and update
interface OptimisticUpdateContext<TRow> {
  previousItems?: TRow[];
}

type MutateOptions<TData, TVariables, TContext> = Omit<
  UseMutationOptions<TData, Error | PostgrestError, TVariables, TContext>,
  'mutationFn' | 'onError'
> & {
  onError?: (
    error: Error | PostgrestError,
    variables: TVariables,
    context: TContext | undefined
  ) => unknown;
};

// CREATE, READ, UPDATE hooks factory
export function createCrudHooks<
  TRow extends { id: string },
  TInsert extends { user_id: string },
  TUpdate,
>(resourceKey: string, service: CrudService<TRow, TInsert, TUpdate>) {
  const useGetAll = () => {
    const { user } = useAuth();
    return useQuery<TRow[], Error | PostgrestError>({
      queryKey: [resourceKey, user?.id],
      queryFn: () => service.getAll(user!.id),
      enabled: !!user,
    });
  };

  const useCreateMutation = (
    options?: MutateOptions<TRow, TInsert, OptimisticUpdateContext<TRow>>
  ) => {
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
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey);
        const tempItem = {
          ...newItemData,
          id: `temp-${Date.now()}`,
        } as unknown as TRow;
        queryClient.setQueryData<TRow[]>(queryKey, (old = []) => [
          ...old,
          tempItem,
        ]);
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

  const useUpdateMutation = (
    options?: MutateOptions<
      TRow,
      { id: string; updates: TUpdate },
      OptimisticUpdateContext<TRow>
    >
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
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey);
        queryClient.setQueryData<TRow[]>(queryKey, (old = []) =>
          old.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
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

  return { useGetAll, useCreateMutation, useUpdateMutation };
}

// A separate, simplified factory for the DELETE mutation.
export function createDeleteMutationHook<TRow extends { id: string }>(
  resourceKey: string,
  service: { delete: (id: string) => Promise<void> }
) {
  return function useDeleteMutation(
    options?: MutateOptions<void, string, OptimisticUpdateContext<TRow>>
  ) {
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
        const previousItems = queryClient.getQueryData<TRow[]>(queryKey);
        queryClient.setQueryData<TRow[]>(queryKey, (old = []) =>
          old.filter((item) => item.id !== itemId)
        );
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
}
