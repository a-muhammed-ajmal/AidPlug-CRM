import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types';

type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

export function useUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: () => userService.getPreferences(user!.id),
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (updates: UserPreferencesUpdate) => userService.updatePreferences(user!.id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['userPreferences', user?.id], data);
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences: updatePreferencesMutation.mutate,
  };
}