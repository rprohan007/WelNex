import { useState, useEffect, useCallback, useRef } from 'react';
import type { InvestmentItem } from '../types';
import { getAllInvestments } from '../data/investmentsData';
import { fetchInvestmentsFromSupabase } from '../services/investmentsService';
import { marketPriceService, isNseListedAsset } from '../services/marketPriceService';

export const useInvestmentData = () => {
  const [investments, setInvestments] = useState<InvestmentItem[]>(() =>
    marketPriceService.hydrateInvestments(getAllInvestments())
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingLiveRef = useRef<boolean>(false);

  // Dynamic Batch Market Data Fetcher:
  // Collects all active asset symbols and calls fetchLivePricesForAssets
  const fetchLiveQuotesForAllListed = useCallback(async (items: InvestmentItem[]) => {
    if (!Array.isArray(items) || items.length === 0 || isFetchingLiveRef.current) return;
    isFetchingLiveRef.current = true;

    try {
      const listedItems = items.filter((inv) => isNseListedAsset(inv));
      const symbols = listedItems.map((inv) => inv.symbolTicker || inv.symbol || inv.id);

      // Dedicated batch market API call with all .NS symbols
      await marketPriceService.fetchLivePricesForAssets(symbols);

      // Overwrite currentPrice, minInvestment, and pChange with exact live values
      setInvestments((prev) => marketPriceService.hydrateInvestments(prev));
    } catch (err) {
      console.warn('[useInvestmentData] Error fetching live prices:', err);
    } finally {
      isFetchingLiveRef.current = false;
    }
  }, []);

  const refreshInvestments = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live base catalogue from Supabase (fallback to local data)
      let baseItems: InvestmentItem[] = [];
      const liveData = await fetchInvestmentsFromSupabase();
      if (liveData && liveData.length > 0) {
        baseItems = liveData;
      } else {
        baseItems = getAllInvestments();
      }

      // 2. Hydrate with current cache and Admin CMS custom prices
      const hydrated = marketPriceService.hydrateInvestments(baseItems);
      setInvestments(hydrated);

      // 3. Dynamically fetch live quotes across all listed assets
      await fetchLiveQuotesForAllListed(baseItems);
      setError(null);
    } catch (err: any) {
      console.warn('[useInvestmentData] Error fetching from Supabase, using local fallback:', err);
      const fallbackItems = getAllInvestments();
      setInvestments(marketPriceService.hydrateInvestments(fallbackItems));
      fetchLiveQuotesForAllListed(fallbackItems);
      setError(err?.message || 'Error fetching investments');
    } finally {
      setIsLoading(false);
    }
  }, [fetchLiveQuotesForAllListed]);

  useEffect(() => {
    refreshInvestments();

    // Subscribe to live market price ticks from marketPriceService
    const unsubscribe = marketPriceService.subscribe(() => {
      setInvestments((prev) => marketPriceService.hydrateInvestments(prev));
    });

    // Periodic live refresh every 30 seconds
    const intervalId = setInterval(() => {
      setInvestments((currentItems) => {
        fetchLiveQuotesForAllListed(currentItems);
        return currentItems;
      });
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [refreshInvestments, fetchLiveQuotesForAllListed]);

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

export const useInvestmentsData = useInvestmentData;
export default useInvestmentData;
