import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useFetchLiveJobs = (source = 'remotive') => {
  return useQuery({
    queryKey: ['liveJobs', source],
    queryFn: async () => {
      const res = await api.get(`/sync/fetch-live?source=${source}`);
      return Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
    },
    staleTime: 5 * 60 * 1000 // 5 mins cache
  });
};

export const useImportJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData) => api.post('/sync/import', jobData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(data.message || 'Job imported into Wishlist!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to import job');
    }
  });
};

export const useTriggerSeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/sync/seed'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(data.message || 'Database seeded with live jobs!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to seed database');
    }
  });
};
