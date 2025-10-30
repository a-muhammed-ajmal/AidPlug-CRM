import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';
import { Database } from '../types';
import { useUI } from '../contexts/UIContextDefinitions;

type UserPreferencesUpdate =
  Database['public']['Tables']['user_preferences']['Update'];

export function useUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addNotification } = useUI();
  const queryKey = ['userPreferences', user?.id];

  const {
    data: preferences,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => userService.getPreferences(user!.id),
    enabled: !!user,
  });

  const updatePreferences = useMutation({
    mutationFn: (updates: UserPreferencesUpdate) =>
      userService.updatePreferences(user!.id, updates),
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(queryKey, updatedPreferences);
      addNotification(
        'Settings Updated',
        'Your preferences have been saved successfully.'
      );
    },
    onError: (error: Error) => {
      addNotification(
        'Update Failed',
        error.message || 'Could not save your preferences.'
      );
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
  };
}
