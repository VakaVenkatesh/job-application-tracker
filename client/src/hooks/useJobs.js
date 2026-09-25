import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useJobs = (filters = {}) => {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.jobType && filters.jobType !== 'all') params.append('jobType', filters.jobType);
      if (filters.experienceLevel && filters.experienceLevel !== 'all') params.append('experienceLevel', filters.experienceLevel);
      if (filters.location && filters.location !== 'all') params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/jobs?${params.toString()}`);
      return response;
    },
    staleTime: 1000 * 30 // 30 seconds
  });

  const applyJobMutation = useMutation({
    mutationFn: async ({ jobId }) => {
      const response = await api.post(`/jobs/${jobId}/apply`);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Application tracked in your pipeline!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit application');
    }
  });

  return {
    jobs: jobsQuery.data?.data || [],
    total: jobsQuery.data?.total || 0,
    pages: jobsQuery.data?.pages || 1,
    currentPage: jobsQuery.data?.page || 1,
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
    error: jobsQuery.error,
    refetch: jobsQuery.refetch,
    applyToJob: applyJobMutation.mutate,
    isApplying: applyJobMutation.isPending
  };
};

export const useJobDetail = (jobId) => {
  return useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId
  });
};

export const useGlobalJobStats = () => {
  return useQuery({
    queryKey: ['global-job-stats'],
    queryFn: async () => {
      const response = await api.get('/jobs/stats/overview');
      return response.data;
    },
    staleTime: 1000 * 60 // 1 minute
  });
};
