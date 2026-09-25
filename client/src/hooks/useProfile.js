import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, updateUser } = useAuth();

  // Fetch full profile with hunter stats
  const profileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.put('/auth/profile', updatedData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
      updateUser({
        name: data.name,
        headline: data.headline,
        skills: data.skills,
        hunterStats: data.hunterStats
      });
      // Invalidate jobs to recalculate skill matches
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Profile & Hunter Rank updated!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile');
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};
