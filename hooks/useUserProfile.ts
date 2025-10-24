import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types';

type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getProfile(user!.id),
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: UserProfileUpdate) => userService.updateProfile(user!.id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', user?.id], data);
    },
  });

  const updateProfile = (updates: UserProfileUpdate, options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onSettled?: () => void;
  }) => {
    updateProfileMutation.mutate(updates, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      onSettled: options?.onSettled,
    });
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
