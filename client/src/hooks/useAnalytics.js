import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics');
      return res.data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
