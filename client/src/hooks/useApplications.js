import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useApplications = (filters = {}) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.stage) params.append('stage', filters.stage);
      if (filters.source) params.append('source', filters.source);
      if (filters.coldEmailStatus) params.append('coldEmailStatus', filters.coldEmailStatus);
      if (filters.sort) params.append('sort', filters.sort);
      
      const res = await api.get(`/applications?${params.toString()}`);
      return res.data;
    }
  });
};

export const useApplication = (id) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/applications/${id}`);
      return res.data;
    },
    enabled: !!id
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAppData) => api.post('/applications', newAppData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Application created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create application');
    }
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/applications/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Application updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update application');
    }
  });
};

export const useMoveStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }) => api.patch(`/applications/${id}/stage`, { stage }),
    onMutate: async ({ id, stage }) => {
      // Optimistic update for fluid drag-and-drop
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousAppsData = queryClient.getQueriesData({ queryKey: ['applications'] });
      
      queryClient.setQueriesData({ queryKey: ['applications'] }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((app) => (app._id === id ? { ...app, stage } : app));
      });

      return { previousAppsData };
    },
    onError: (err, variables, context) => {
      if (context?.previousAppsData) {
        context.previousAppsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.message || 'Failed to move application stage');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Application deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete application');
    }
  });
};

export const useAddContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contact }) => api.post(`/applications/${id}/contacts`, contact),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Contact added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add contact');
    }
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }) => api.post(`/applications/${id}/notes`, note),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      toast.success('Note added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add note');
    }
  });
};
