import { useState, useEffect, useCallback } from 'react';
import type { InvestmentItem } from '../types';
import { getAllInvestments } from '../data/investmentsData';
import { fetchInvestmentsFromSupabase } from '../services/investmentsService';

export const useInvestmentsData = () => {
  const [investments, setInvestments] = useState<InvestmentItem[]>(() => getAllInvestments());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshInvestments = useCallback(async () => {
    setIsLoading(true);
    try {
      const liveData = await fetchInvestmentsFromSupabase();
      if (liveData && liveData.length > 0) {
        setInvestments(liveData);
      }
      setError(null);
    } catch (err: any) {
      console.warn('[useInvestmentsData] Error fetching from Supabase, using local fallback:', err);
      setError(err?.message || 'Error fetching investments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInvestments();
  }, [refreshInvestments]);

  const getInvestmentById = useCallback((id: string): InvestmentItem | undefined => {
    return investments.find((item) => item.id === id);
  }, [investments]);

  return {
    investments,
    isLoading,
    error,
    refreshInvestments,
    getInvestmentById
  };
};
