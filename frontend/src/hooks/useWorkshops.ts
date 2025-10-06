import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Workshop } from '../types';

/**
 * Custom React hook to fetch and filter workshops from the backend.
 * Supports pagination, filtering by category, skill level, and status.
 */
export const useWorkshops = (options: {
  page?: number;
  limit?: number;
  category?: string;
  skillLevel?: string;
  status?: string;
} = {}) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch workshops with filters
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Explicitly tell TypeScript the return type is Workshop[]
      const data: Workshop[] = await apiService.getWorkshops(options);
      setWorkshops(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch workshops';
      setError(message);
      console.error('❌ Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-run fetch when filter options change
  useEffect(() => {
    fetchWorkshops();
  }, [options.page, options.limit, options.category, options.skillLevel, options.status]);

  return {
    workshops,
    loading,
    error,
    refetch: fetchWorkshops,
  };
};
