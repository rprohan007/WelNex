import { useState, useEffect, useCallback } from 'react';
import type { InvestmentItem } from '../types';
import { getAllInvestments } from '../data/investmentsData';
import { fetchInvestmentsFromSupabase } from '../services/investmentsService';
import { marketPriceService } from '../services/marketPriceService';

export const useInvestmentsData = () => {
  const [investments, setInvestments] = useState<InvestmentItem[]>(() =>
    marketPriceService.hydrateInvestments(getAllInvestments())
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshInvestments = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Kick off concurrent live NSE market price refresh
      marketPriceService.refreshAllListedPrices().catch((err) => {
        console.warn('[useInvestmentsData] Live NSE market price fetch warning:', err);
      });

      // 2. Fetch live base catalogue from Supabase
      const liveData = await fetchInvestmentsFromSupabase();
      if (liveData && liveData.length > 0) {
        // Hydrate with live NSE ticks while keeping Admin CMS minimum ticket overrides for private fractional CRE
        const hydrated = marketPriceService.hydrateInvestments(liveData);
        setInvestments(hydrated);
      } else {
        // Fallback to local data hydrated with live NSE ticks
        setInvestments(marketPriceService.hydrateInvestments(getAllInvestments()));
      }
      setError(null);
    } catch (err: any) {
      console.warn('[useInvestmentsData] Error fetching from Supabase, using hydrated local fallback:', err);
      setInvestments(marketPriceService.hydrateInvestments(getAllInvestments()));
      setError(err?.message || 'Error fetching investments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInvestments();

    // Subscribe to live market price ticks
    const unsubscribe = marketPriceService.subscribe(() => {
      setInvestments((prev) => marketPriceService.hydrateInvestments(prev));
    });

    return () => {
      unsubscribe();
    };
  }, [refreshInvestments]);

  const getInvestmentById = useCallback(
    (id: string): InvestmentItem | undefined => {
      return investments.find((item) => item.id === id);
    },
    [investments]
  );

  return {
    investments,
    isLoading,
    error,
    refreshInvestments,
    getInvestmentById
  };
};

export default useInvestmentsData;
