import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types';
import { useUI } from '../contexts/UIContext';

type UserProfileUpdate =
  Database['public']['Tables']['user_profiles']['Update'];

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addNotification } = useUI();
  const queryKey = ['userProfile', user?.id];

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => userService.getProfile(user!.id),
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: (updates: UserProfileUpdate) =>
      userService.updateProfile(user!.id, updates),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKey, updatedProfile); // Optimistically update cache
      addNotification('Profile Updated', 'Your changes have been saved.');
    },
    onError: (error: Error) => {
      addNotification(
        'Update Failed',
        error.message || 'Could not save your profile.'
      );
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile, // Expose the entire mutation object
  };
}
